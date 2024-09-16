<?php
/**
 * Plugin Name: Cotizador PDF
 * Author: AlekhArt.codes
 * Author URI: https://github.com/VitokoMp
 * Version: 1.1.8
 * Description: WordPress React pdf cotizacion.
 * Text-Domain: wp-react-pdf-cotizacion 
 */

if ( ! defined( 'ABSPATH' ) ) exit; // No direct access allowed.

/**
 * Define Plugins Constants
 */
define ( 'WPRK_PATH', trailingslashit( plugin_dir_path( __FILE__ ) ) );
define ( 'WPRK_URL', trailingslashit( plugins_url( '/', __FILE__ ) ) );

/**
 * Clase para crear la página de administración del plugin, encolar los scripts necesarios y definir los puntos finales de la API REST.
 */
class WPRK_Plugin {

    public function __construct() {
        // Crear menú y encolar scripts
        add_action('admin_menu', [$this, 'create_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
        
        // Definir rutas de la API REST
        add_action('rest_api_init', [$this, 'create_rest_routes']);
    }

    public function create_admin_menu() {
        add_menu_page(
            __('Cotizador PDF', 'wp-react-pdf-cotizacion'),
            __('Cotizador PDF', 'wp-react-pdf-cotizacion'),
            'manage_options',
            'wprk-settings',
            [$this, 'menu_page_template'],
            'dashicons-buddicons-replies'
        );
    }

    public function menu_page_template() {
        echo '<div class="wrap">
            <!-- Contenedor para la aplicación React sin el título -->
            <div id="wprk-admin-app" style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"></div>
        </div>';
    }
    

    public function enqueue_scripts($hook) {
        if ($hook !== 'toplevel_page_wprk-settings') {
            return;
        }

        wp_enqueue_script(
            'my-react-app',
            WPRK_URL . 'dist/bundle.js', // Ruta al archivo bundle.js
            ['wp-element'], // Dependencias de WordPress, incluyendo wp-element para React
            null,
            true // Cargar en el pie del documento
        );

        wp_localize_script('my-react-app', 'appLocalizer', [
            'apiUrl' => esc_url(rest_url('wprk/v1')), // URL para tu API REST
            'nonce' => wp_create_nonce('wp_rest'), // Nonce para autenticación en la API
        ]);
    }

    public function create_rest_routes() {
        // Ruta para añadir cotización
        register_rest_route('wprk/v1', '/add-quote', [
            'methods' => 'POST',
            'callback' => [$this, 'add_quote'],
            'permission_callback' => [$this, 'add_quote_permission']
        ]);

        // Ruta para obtener cotizaciones
        register_rest_route('wprk/v1', '/get-quotes', [
            'methods' => 'GET',
            'callback' => [$this, 'get_quotes'],
            'permission_callback' => '__return_true'
        ]);
        //Ruta para actualizar el estado 
        register_rest_route('wprk/v1', '/update-quote-state', [
            'methods' => 'POST',
            'callback' => [$this, 'update_quote_state'],
            'permission_callback' => [$this, 'update_quote_state_permission']
        ]);

        // Ruta para actualizar una cotización

    register_rest_route('wprk/v1', '/update-quote/(?P<id>\d+)', [
        'methods' => 'POST',
        'callback' => [$this, 'update_quote'],
        'permission_callback' => [$this, 'update_quote_permission'],
    ]);
    

        // Ruta para obtener una cotización por ID
    register_rest_route('wprk/v1', '/get-quote/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => [$this, 'get_quote_by_id'],
        'permission_callback' => '__return_true',
    ]);

    }

    public function get_quotes() {
        $args = [
            'post_type'   => 'quote',
            'post_status' => 'publish',
            'numberposts' => -1
        ];

        $quotes = get_posts($args);
        $response = [];

        foreach ($quotes as $quote) {
            $meta = get_post_meta($quote->ID);
            $items_json = $meta['_items'][0] ?? '';

            // Decodificar JSON
            $items = $items_json ? json_decode($items_json, true) : [];

            $response[] = [
                'id' => $quote->ID,
                'title' => $quote->post_title,
                'nro_orden' => $meta['_nro_orden'][0] ?? '',
                'nro_de_cotizacion' => $meta['_nro_de_cotizacion'][0] ?? '',
                'nro_de_factura' => $meta['_nro_de_factura'][0] ?? '',
                'fecha' => $meta['_fecha'][0] ?? '',
                'estado' => $meta['_estado'][0] ?? '',
                'items' => $items,
                'nota' => $meta['_nota'][0] ?? '',
            ];
        }

        error_log(print_r($response, true)); // Para depuración

        return rest_ensure_response($response);
    }

    public function add_quote($req) {
        // Sanitizar los datos de la solicitud
        $nro_orden = sanitize_text_field($req['nro_orden']);
        $nro_de_factura = sanitize_text_field($req['nro_de_factura']);
        $fecha = sanitize_text_field($req['fecha']);
        $cliente = sanitize_text_field($req['cliente']);
        $estado = sanitize_text_field($req['estado']);
        $items = json_encode($req['items']); // Convertir a JSON
        $nota = sanitize_textarea_field($req['nota']);
    
        // Insertar el post
        $quote_id = wp_insert_post([
            'post_title'   => $cliente,
            'post_type'    => 'quote',
            'post_status'  => 'publish',
            'meta_input'   => [
                '_nro_orden' => $nro_orden,                
                '_nro_de_factura' => $nro_de_factura,
                '_fecha' => $fecha,
                '_estado' => $estado,
                '_items' => $items,  // Guardar como JSON
                '_nota' => $nota,
            ],
        ]);
    
        // Manejar errores al insertar el post
        if (is_wp_error($quote_id)) {
            return rest_ensure_response([
                'status'  => 'error',
                'message' => 'No se pudo crear la cotización.',
            ]);
        }
    
        // Crear el número de cotización y actualizar el post meta
        $nro_de_cotizacion = 'COT-' . str_pad($quote_id, 6, '0', STR_PAD_LEFT);
        update_post_meta($quote_id, '_nro_de_cotizacion', $nro_de_cotizacion);
    
        // Obtener los metadatos del post
        $meta = get_post_meta($quote_id);
    
        // Preparar la respuesta
        $response = [
            'status' => 'success',
            'quote_id' => $quote_id,
            'nro_orden' => $meta['_nro_orden'][0] ?? '',
            'nro_de_cotizacion' => $nro_de_cotizacion,
            'nro_de_factura' => $meta['_nro_de_factura'][0] ?? '',
            'fecha' => $meta['_fecha'][0] ?? '',
            'cliente' => $cliente,
            'estado' => $meta['_estado'][0] ?? '',
            'items' => json_decode($meta['_items'][0] ?? '[]', true),  // Decodificar como JSON
            'nota' => $meta['_nota'][0] ?? '',
        ];
    
        return rest_ensure_response($response);
    }
    public function update_quote_state($req) {
        $id = intval($req['id']);
        $estado = sanitize_text_field($req['estado']);
    
        if (!$id || !$estado) {
            return rest_ensure_response([
                'status' => 'error',
                'message' => 'ID de cotización o estado inválido.',
            ]);
        }
    
        // Actualizar el meta campo de estado
        update_post_meta($id, '_estado', $estado);
    
        return rest_ensure_response([
            'status' => 'success',
            'message' => 'Estado actualizado correctamente.',
        ]);
    }
    
    //validacion del nivel de usuario
    public function update_quote_state_permission() {
        return current_user_can('publish_posts');
    }

    public function update_quote($req) {
        $id = intval($req['id']);
        $nro_orden = sanitize_text_field($req['nro_orden']);
        $nro_de_factura = sanitize_text_field($req['nro_de_factura']);
        $fecha = sanitize_text_field($req['fecha']);
        $cliente = sanitize_text_field($req['cliente']);
        $estado = sanitize_text_field($req['estado']);
        $items = json_encode($req['items']);
        $nota = sanitize_textarea_field($req['nota']);
    
        if (!$id || !$cliente) {
            return rest_ensure_response([
                'status' => 'error',
                'message' => 'ID de cotización o cliente inválido.',
            ]);
        }
    
        // Actualizar el post y los campos meta
        $post_data = [
            'ID' => $id,
            'post_title' => $cliente,
        ];
        wp_update_post($post_data);
    
        update_post_meta($id, '_nro_orden', $nro_orden);
        update_post_meta($id, '_nro_de_factura', $nro_de_factura);
        update_post_meta($id, '_fecha', $fecha);
        update_post_meta($id, '_estado', $estado);
        update_post_meta($id, '_items', $items);
        update_post_meta($id, '_nota', $nota);
    
        return rest_ensure_response([
            'status' => 'success',
            'message' => 'Cotización actualizada correctamente.',
        ]);
    }
    
    public function update_quote_permission() {
        return current_user_can('publish_posts');
    }
    
    public function add_quote_permission() {
        if (current_user_can('publish_posts')) {
            return true;
        } else {
            error_log('El usuario no tiene permisos para publicar posts.');
            return false;
        }
    }

    public function get_quote_by_id($data) {
        $id = intval($data['id']);
        
        // Verificar si el ID es válido
        if (!$id) {
            return new WP_Error('invalid_id', 'ID inválido', ['status' => 400]);
        }
    
        // Obtener el post
        $quote = get_post($id);
    
        // Verificar si la cotización existe
        if (!$quote) {
            return new WP_Error('no_quote', 'Cotización no encontrada', ['status' => 404]);
        }
    
        // Obtener los metadatos
        $meta = get_post_meta($id);
        $items_json = $meta['_items'][0] ?? '';
    
        // Decodificar JSON
        $items = $items_json ? json_decode($items_json, true) : [];
    
        // Preparar la respuesta
        $response = [
            'id' => $id,
            'cliente' => $quote->post_title,
            'nro_orden' => $meta['_nro_orden'][0] ?? '',
            'nro_de_cotizacion' => $meta['_nro_de_cotizacion'][0] ?? '',
            'nro_de_factura' => $meta['_nro_de_factura'][0] ?? '',
            'fecha' => $meta['_fecha'][0] ?? '',
            'estado' => $meta['_estado'][0] ?? '',
            'items' => $items,
            'nota' => $meta['_nota'][0] ?? '',
        ];
    
        return rest_ensure_response($response);
    }
    
    
}

// Instanciar la clase
new WPRK_Plugin();
