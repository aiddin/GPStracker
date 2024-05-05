import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'leaflet/dist/leaflet.css'
import { loadScript } from 'esri-loader';

const options = {
    url: 'https://js.arcgis.com/3.23/',
  };
  loadScript(options)
  
createApp(App).mount('#app')
