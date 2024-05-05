<template>
    <div id="map" style="height: 500px; width: 100%"></div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Map from 'ol/Map'
  import View from 'ol/View'
  import TileLayer from 'ol/layer/Tile'
  import OSM from 'ol/source/OSM'
  
  const mapElement = ref(null)
  
  const map = new Map({
    target: mapElement.value,
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  })
  
  map.addLayer(
    new TileLayer({
      source: new OSM()
    })
  )
  </script>