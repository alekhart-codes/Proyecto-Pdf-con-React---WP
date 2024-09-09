<?php
/**
 * Este archivo creará la página de administración del plugin y encolará los scripts necesarios.
 */

class WPRK_Create_Admin_Page {

    public function __construct() {
        add_action('admin_menu', [$this, 'create_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
    }

    public function create_admin_menu() {
        $capability = 'manage_options';
        $slug = 'wprk-settings';

        add_menu_page(
            __('Cotizador PDF', 'wp-react-pdf-cotizacion'),
            __('Cotizador PDF', 'wp-react-pdf-cotizacion'),
            $capability,
            $slug,
            [$this, 'menu_page_template'],
            'dashicons-buddicons-replies'
        );
    }

    public function menu_page_template() {
        echo '<div class="wrap"><div id="wprk-admin-app"></div></div>'; // Punto de montaje para tu aplicación React
    }

    public function enqueue_scripts($hook) {
        // Solo encolar en la página de administración correcta
        if ($hook !== 'toplevel_page_wprk-settings') {
            return;
        }

        wp_enqueue_script(
            'my-react-app',
            plugins_url('/path/to/your/bundle.js', __FILE__), // Ajusta la ruta al archivo bundle.js de tu aplicación React
            ['wp-element'], // Dependencias, incluyendo wp-element para React
            null,
            true
        );

        wp_localize_script('my-react-app', 'appLocalizer', [
            'apiUrl' => esc_url(rest_url('wprk/v1')), // URL para tu API REST
            'nonce' => wp_create_nonce('wp_rest'), // Nonce para autenticación en la API
        ]);
    }
}

// Instanciar la clase
new WPRK_Create_Admin_Page();
