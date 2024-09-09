<?php
/**
 * Función para crear la página de administración del plugin.
 */
function my_plugin_admin_page() {
    ?>
    <div id="wprk-admin-app"></div> <!-- Este es el punto de montaje para tu aplicación React -->
    <?php
}


/**
 * Función para encolar los scripts y estilos necesarios para la página de administración.
 */
function my_plugin_enqueue_scripts($hook) {
    // Solo encolar en la página de administración correcta
    if ($hook !== 'toplevel_page_wprk-settings') {
        return;
    }

    wp_enqueue_script(
        'my-react-app',
        plugins_url('dist/bundle.js', __FILE__), // Ajusta la ruta al archivo bundle.js de tu aplicación React
        array('wp-element'), // Dependencias, incluyendo wp-element para React
        null,
        true
    );

    wp_localize_script('my-react-app', 'appLocalizer', array(
        'apiUrl' => esc_url(rest_url('wprk/v1')), // URL para tu API REST
        'nonce' => wp_create_nonce('wp_rest'), // Nonce para autenticación en la API
    ));
}

// Añadir la página al menú de administración
add_action('admin_menu', function() {
    add_menu_page(
        'Add Quotes and PDF', // Título de la página
        'Cotizador', // Título del menú
        'manage_options', // Capacidad requerida
        'wprk-settings', // Slug de la página
        'my_plugin_admin_page' // Función que renderiza el contenido de la página
    );
});

// Encolar scripts y estilos para la página de administración
add_action('admin_enqueue_scripts', 'my_plugin_enqueue_scripts');
