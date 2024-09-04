<?php
/**
 * This file will create admin menu page.
 */

class WPRK_Create_Admin_Page {

    public function __construct() {
        add_action( 'admin_menu', [ $this, 'create_admin_menu' ] );
    }

    public function create_admin_menu() {
        $capability = 'manage_options';
        $slug = 'wprk-settings';

        add_menu_page(
            __( 'Cotidazor PDF', 'wp-react-pdf-cotizacion' ),
            __( 'Cotizador PDF', 'wp-react-pdf-cotizacion' ),
            $capability,
            $slug,
            [ $this, 'menu_page_template' ],
            'dashicons-buddicons-replies'
        );
    }

    public function menu_page_template() {
        echo '<div class="wrap"><div id="wprk-admin-app"></div></div>';
        echo 'Hello World';
    }

}
new WPRK_Create_Admin_Page();