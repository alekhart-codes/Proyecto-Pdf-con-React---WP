<?php
/**
 * This file will create Custom Rest API End Points.
 */
class WP_React_Settings_Rest_Route {

    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'create_rest_routes' ] );
    }

    public function create_rest_routes() {
     
        // Ruta para añadir cotización
        register_rest_route( 'wprk/v1', '/add-quote', [
            'methods' => 'POST',
            'callback' => [ $this, 'add_quote' ],
            'permission_callback' => [ $this, 'add_quote_permission' ]
        ]);

        // Ruta para obtener cotizaciones
        register_rest_route( 'wprk/v1', '/get-quotes', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_quotes' ],
            'permission_callback' => '__return_true'
        ]);

        //ruta para obtener ultima cotizacion
        register_rest_route( 'wprk/v1', '/get_last_quote' , [
            'methods' => 'GET',
            'callback' => [ $this, 'get_last_quote' ],
            'permission_callback' => '__return_true'
        ]);
    }
    
    public function get_quotes() {

        $args = [
            'post_type'   => 'quote',
            'post_status' => 'publish',
            'numberposts' => -1
        ];
    
        $quotes = get_posts( $args );
        $response = [];
    
        foreach ( $quotes as $quote ) {
            $meta = get_post_meta( $quote->ID );
            $response[] = [
                'id' => $quote->ID,
                'title' => $quote->post_title,
                'nro_orden' => $meta['_nro_orden'][0] ?? '',
                'nro_de_cotizacion' => $meta['_nro_de_cotizacion'][0] ?? '',
                'nro_de_factura' => $meta['_nro_de_factura'][0] ?? '',
                'fecha' => $meta['_fecha'][0] ?? '',
                'estado' => $meta['_estado'][0] ?? '',
                'items' => maybe_unserialize( $meta['_items'][0] ) ?? [],
                'nota' => $meta['_nota'][0] ?? '',
            ];
        }
    
        return rest_ensure_response( $response );
    }
    

    public function add_quote( $req ) {
        $nro_de_cotizacion_auto = sanitize_text_field( $req['nro_cotizacion_ultimo'] );
        $nro_orden = sanitize_text_field( $req['nro_orden'] );
        $nro_de_cotizacion = sanitize_text_field( $req[$nro_de_cotizacion_auto] );
        $nro_de_factura = sanitize_text_field( $req['nro_de_factura'] );
        $fecha = sanitize_text_field( $req['fecha'] );
        $cliente = sanitize_text_field( $req['cliente'] );
        $estado = sanitize_text_field( $req['estado'] );
        $items = $req['items'];
        $nota = sanitize_textarea_field( $req['nota'] );

        $quote_id = wp_insert_post([
            'post_title'   => $cliente,
            'post_type'    => 'quote',
            'post_status'  => 'publish',
            'ID' => $nro_de_cotizacion,
            'meta_input'   => [
                '_nro_orden' => $nro_orden,                
                '_nro_de_factura' => $nro_de_factura,
                '_fecha' => $fecha,
                '_estado' => $estado,
                '_items' => maybe_serialize( $items ),
                '_nota' => $nota,
            ],
        ]); 

        if (is_wp_error($quote_id)) {
            return rest_ensure_response([
                'status'  => 'error',
                'message' => 'No se pudo crear la cotización.',
            ]);
        }

        return rest_ensure_response([
            'status'  => 'success',
            'quote_id' => $quote_id,
        ]);
    }

    public function add_quote_permission() {
        return current_user_can( 'publish_posts' );
    }
}

new WP_React_Settings_Rest_Route();
