<?php
/**
 * Plugin Name: Cotizaciones PDF KO
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
 * Clase para crear la página de administración del plugin y encolar los scripts necesarios.
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

        // Encolar el script de React
        wp_enqueue_script(
            'my-react-app',
            WPRK_URL . 'dist/bundle.js', // Ruta al archivo bundle.js
            ['wp-element'], // Dependencias de WordPress, incluyendo wp-element para React
            null,
            true // Cargar en el pie del documento
        );

        // Localizar el script con datos necesarios
        wp_localize_script('my-react-app', 'appLocalizer', [
            'apiUrl' => esc_url(rest_url('wprk/v1')), // URL para tu API REST
            'nonce' => wp_create_nonce('wp_rest'), // Nonce para autenticación en la API
        ]);
    }
}

// Instanciar la clase
new WPRK_Create_Admin_Page();
