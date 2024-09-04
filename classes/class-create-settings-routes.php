<?php
/**
 * This file will create Custom Rest API End Points.
 */
class WP_React_Settings_Rest_Route {

    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'create_rest_routes' ] );
    }

    public function create_rest_routes() {
        // Ruta para obtener configuraciones.
        register_rest_route( 'wprk/v1', '/settings', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_settings' ],
            'permission_callback' => [ $this, 'get_settings_permission' ]
        ] );

        // Ruta para guardar configuraciones.
        register_rest_route( 'wprk/v1', '/settings', [
            'methods' => 'POST',
            'callback' => [ $this, 'save_settings' ],
            'permission_callback' => [ $this, 'save_settings_permission' ]
        ] );

        // Nueva ruta para crear una cotización.
        register_rest_route( 'wprk/v1', '/add-quote', [
            'methods' => 'POST',
            'callback' => [ $this, 'add_quote' ],
            'permission_callback' => [ $this, 'add_quote_permission' ]
        ] );

        // Ruta para obtener cotizaciones.
        register_rest_route( 'wprk/v1', '/quotes', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_quotes' ],
            'permission_callback' => [ $this, 'get_quotes_permission' ]
        ] );
    }

    // Método para obtener configuraciones.
    public function get_settings() {
        $firstname = get_option( 'wprk_settings_firstname' );
        $lastname  = get_option( 'wprk_settings_lastname' );
        $email     = get_option( 'wprk_settings_email' );
        $response = [
            'firstname' => $firstname,
            'lastname'  => $lastname,
            'email'     => $email
        ];

        return rest_ensure_response( $response );
    }

    // Permisos para obtener configuraciones.
    public function get_settings_permission() {
        return true;
    }

    // Método para guardar configuraciones.
    public function save_settings( $req ) {
        $firstname = sanitize_text_field( $req['firstname'] );
        $lastname  = sanitize_text_field( $req['lastname'] );
        $email     = sanitize_text_field( $req['email'] );
        update_option( 'wprk_settings_firstname', $firstname );
        update_option( 'wprk_settings_lastname', $lastname );
        update_option( 'wprk_settings_email', $email );
        return rest_ensure_response( 'success' );
    }

    // Permisos para guardar configuraciones.
    public function save_settings_permission() {
        return current_user_can( 'publish_posts' );
    }

    // Método para agregar una nueva cotización.
    public function add_quote( $req ) {
        // Valida y sanitiza los datos recibidos desde el request.
        $client_name = sanitize_text_field( $req['client_name'] );
        $quote_total = sanitize_text_field( $req['quote_total'] );
        $quote_items = sanitize_text_field( $req['quote_items'] );

        // Crea un nuevo post de tipo "cotización".
        $quote_id = wp_insert_post([
            'post_title'   => $client_name,
            'post_type'    => 'quote',
            'post_status'  => 'publish',
            'meta_input'   => [
                '_quote_total' => $quote_total,
                '_quote_items' => $quote_items,
            ],
        ]);

        // Verifica si la creación del post fue exitosa.
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

    // Permisos para agregar una nueva cotización.
    public function add_quote_permission() {
        return current_user_can( 'publish_posts' );
    }

    // Método para obtener cotizaciones.
    public function get_quotes() {
        $args = [
            'post_type'   => 'quote',
            'post_status' => 'publish',
            'posts_per_page' => -1,
        ];

        $query = new WP_Query( $args );
        $cotizaciones = [];

        while ( $query->have_posts() ) {
            $query->the_post();
            $cotizaciones[] = [
                'id'          => get_the_ID(),
                'descripcion' => get_the_title(),
                'monto'       => get_post_meta( get_the_ID(), '_quote_total', true ),
                'items'       => get_post_meta( get_the_ID(), '_quote_items', true ),
            ];
        }

        wp_reset_postdata();

        return rest_ensure_response( $cotizaciones );
    }

    // Permisos para obtener cotizaciones.
    public function get_quotes_permission() {
        return current_user_can( 'read' );
    }
}

// Inicializa la clase para que las rutas se registren.
new WP_React_Settings_Rest_Route();