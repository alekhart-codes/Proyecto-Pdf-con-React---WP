# wp-react-Plugin-PDF

## English Version

### A React JS WordPress Plugin Starter

**Designed with Open Source Code**

This plugin follows the best implementation practices for Babel and Webpack with React!

### Version: 1.1.5

### License: APACHE 2.0

---

### 📌 Installation Instructions

#### 1. Install the Plugin

1. Copy the plugin folder **wp-react-pdf-cotizacion** to your WordPress installation directory:
   ```
   wp-content/plugins/
   ```
2. Navigate to your WordPress admin panel.
3. Go to **Plugins > Installed Plugins** and activate **WP React PDF Cotización**.

#### 2. Install Dependencies

1. Open a terminal in the plugin folder:
   ```sh
   cd wp-content/plugins/wp-react-pdf-cotizacion
   ```
2. Install all required dependencies:
   ```sh
   npm install
   ```
3. Install `cross-env` as a development dependency:
   ```sh
   npm install cross-env --save-dev
   ```

#### 3. Build the Plugin

Run the following command to compile the assets:

```sh
npm run build
```

For development mode (auto-watch for changes):

```sh
npm run start
```

---

## 📦 Dependencies

```json
{
  "name": "wp-react-pdf-cotizacion",
  "version": "1.1.5",
  "main": "index.js",
  "dependencies": {
    "axios": "^1.7.7",
    "file-saver": "^2.0.5",
    "pdf-lib": "^1.17.1",
    "php-serialize": "^5.0.1",
    "php-unserialize": "^0.0.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-modal": "^3.16.1",
    "react-router-dom": "^6.26.1"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.4",
    "@babel/preset-react": "^7.24.7",
    "babel-loader": "^9.1.3",
    "cross-env": "^7.0.3",
    "css-loader": "^7.1.2",
    "style-loader": "^4.0.0",
    "terser-webpack-plugin": "^5.3.10",
    "webpack": "^5.94.0",
    "webpack-cli": "^5.1.4"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "cross-env NODE_ENV=production webpack",
    "start": "cross-env NODE_ENV=development webpack --watch"
  }
}
```

---

**Optimized by AlekhArt.codes**

---

## Versión en Español

### Un Plugin de WordPress con React JS

**Diseñado con código libre**

Este plugin sigue las mejores prácticas de implementación para Babel y Webpack con React.

### Versión: 1.1.5

### Licencia: APACHE 2.0

---

### 📌 Instrucciones de Instalación

#### 1. Instalar el Plugin

1. Copia la carpeta del plugin **wp-react-pdf-cotizacion** en la instalación de WordPress:
   ```
   wp-content/plugins/
   ```
2. Ve al panel de administración de WordPress.
3. Dirígete a **Plugins > Plugins instalados** y activa **WP React PDF Cotización**.

#### 2. Instalar Dependencias

1. Abre una terminal en la carpeta del plugin:
   ```sh
   cd wp-content/plugins/wp-react-pdf-cotizacion
   ```
2. Instala todas las dependencias necesarias:
   ```sh
   npm install
   ```
3. Instala `cross-env` como dependencia de desarrollo:
   ```sh
   npm install cross-env --save-dev
   ```

#### 3. Compilar el Plugin

Ejecuta el siguiente comando para compilar los archivos:

```sh
npm run build
```

Para el modo desarrollo (supervisión automática de cambios):

```sh
npm run start
```

---

## 📦 Dependencias

Ver la sección de dependencias en la versión en inglés.

---

**Optimizado por AlekhArt.codes**

