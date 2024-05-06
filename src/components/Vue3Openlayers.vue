<template>
    <div>
      <div id="map" style="width: 100%; height: 400px;"> </div>
      <button @click="startRecording" style="margin-right:100px">START</button>
      <button @click="stopRecording"  style="margin-right:100px">STOP</button>
      <button @click="dropMarker">(+)</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import 'ol/ol.css';
  import { Map, View } from 'ol';
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
  import { OSM, Vector as VectorSource } from 'ol/source';
  import { Style, Circle, Fill, Stroke } from 'ol/style';
  
  import Feature from 'ol/Feature.js';
  import { useGeographic } from 'ol/proj';
  import  Overlay  from 'ol/Overlay';
  import html2canvas from "html2canvas";
  import marker from "../assets/vue.svg"
  import LineString from 'ol/geom/LineString.js';
  const map = ref(null);
  const recording = ref(false);
  const pathCoordinates = ref([]);
  const markers = ref([]);
  const vectorSource = new VectorSource(); // Create a VectorSource instance

  onMounted(() => {
    useGeographic();
    initializeMap();
  });
  
  const initializeMap = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
  
        map.value = new Map({
          target: 'map',
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
            new VectorLayer({
            source: vectorSource,
          }),
          ],
          view: new View({
            center: [longitude, latitude],
            zoom: 17,
          }),
        });
      }
    );
  }
  const dropMarker = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = [position.coords.longitude, position.coords.latitude];
      console.log(coords);

      if (!map.value) {
        console.error("Map is not initialized.");
        return;
      }

      const view = map.value.getView();
      view.setCenter(coords);

      const markerElement = document.createElement('div');
      markerElement.innerHTML = `<img src="${marker}" alt="Marker">`;

      const markerOverlay = new Overlay({
        position: coords,
        element: markerElement,
        stopEvent: false,
      });

      if (map.value) {
        map.value.addOverlay(markerOverlay);
      } else {
        console.error("Map is not initialized.");
      }

      markers.value.push(coords);
    },
    (error) => {
      console.error(error);
    },
    { timeout: 10000 }
  );
};
  
const startRecording = () => {
  recording.value = true;
  pathCoordinates.value = [];
  markers.value = [];
  recordCoordinate()
  dropMarker();
}
let geolocationWatchId;
const recordCoordinate = () => {
  navigator.geolocation.watchPosition(
    (position) => {
      const coords = [position.coords.longitude, position.coords.latitude];

      if (!map.value) {
        console.error("Map is not initialized.");
        return;
      }

      const view = map.value.getView();
      view.setCenter(coords);

      const markerElement = document.createElement('div');
      markerElement.innerHTML = `<img src="${marker}" alt="Marker">`;

      const markerOverlay = new Overlay({
        position: coords,
        element: markerElement,
        stopEvent: false,
      });

      if (map.value) {
        map.value.addOverlay(markerOverlay);
      } else {
        console.error("Map is not initialized.");
      }

      markers.value.push(coords);

      // Add a connecting line between the current marker and the previous one
      const previousCoord = markers.value[markers.value.length - 2];
      console.log(markers.value)
      if (previousCoord) {
        const lineString = new LineString([previousCoord, coords]);
const feature = new Feature({ geometry: lineString });

const lineStyle = new Style({
  stroke: new Stroke({
    color: 'red', // Set the color of the line
    width: 5, // Set the desired width of the line
  }),
});
console.log(lineString)
feature.setStyle(lineStyle);
vectorSource.addFeature(feature);
      }
    },

    (error) => {
      console.error(error);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};
  const stopRecording = () => {
    captureMap()
    navigator.geolocation.clearWatch(geolocationWatchId);

  }
  
 

 

  const captureMap = async () => {
  const mapContainerElement = document.getElementById("map");
  html2canvas(mapContainerElement).then((canvas) => {
    const image = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = image;
    link.download = 'map_capture.png';
    link.click();
  });
};
  </script>
  
  <style scoped>
  #map {
    width: 100%;
    height: 400px;
  }
  </style>