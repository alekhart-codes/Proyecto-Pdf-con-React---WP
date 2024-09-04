
# wp-react-kickoff

A React JS WordPress Plugin Starter
**Diseñado con codigo libre**
Licencia APACHE 2.0
tengo el agrado de entregar esta version que contiene las mejores practicas de implementacion para Babel y webPack con REACT!
version 1.0.4
Necesitas instalar cross-env --save-dev
# npm install at package.json
{
  "name": "wp-react-pdf-cotizacion",
  "version": "1.0.4",
  "main": "index.js",
  "dependencies": {
    "axios": "^1.7.7",
    "react": "^16.7.0",
    "react-dom": "^16.7.0",
    "react-router-dom": "^6.26.1"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.4",
    "@babel/preset-react": "^7.24.7",
    "babel-loader": "^9.1.3",
    "cross-env": "^7.0.3",
    "webpack": "^5.94.0",
    "webpack-cli": "^5.1.4"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "cross-env NODE_ENV=production webpack",
    "start": "cross-env NODE_ENV=development webpack --watch"
  }
}


**Optimizado por AlekhArt.codes**
> Written with [StackEdit](https://stackedit.io/).