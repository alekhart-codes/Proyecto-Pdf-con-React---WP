<?php
/**
 * Plugin Name: Cotizaciones PDF
 * Author: Victor Molina
 * Author URI: https://github.com/VitokoMp
 * Version: 1.0.8
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
        // Contenedor para la aplicación React
        echo '<div class="wrap">
            <h1>' . esc_html__('Cotizador PDF', 'wp-react-pdf-cotizacion') . '</h1>
            <div id="wprk-admin-app"></div>
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
        $nro_orden = sanitize_text_field($req['nro_orden']);
        $nro_de_factura = sanitize_text_field($req['nro_de_factura']);
        $fecha = sanitize_text_field($req['fecha']);
        $cliente = sanitize_text_field($req['cliente']);
        $estado = sanitize_text_field($req['estado']);
        $items = json_encode($req['items']); // Convertir a JSON
        $nota = sanitize_textarea_field($req['nota']);

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

        if (is_wp_error($quote_id)) {
            return rest_ensure_response([
                'status'  => 'error',
                'message' => 'No se pudo crear la cotización.',
            ]);
        }

        $nro_de_cotizacion = 'COT-' . str_pad($quote_id, 6, '0', STR_PAD_LEFT);
        update_post_meta($quote_id, '_nro_de_cotizacion', $nro_de_cotizacion);

        $meta = get_post_meta($quote_id);

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

    public function add_quote_permission() {
        return current_user_can('publish_posts');
    }
}

// Instanciar la clase
new WPRK_Plugin();
