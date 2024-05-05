<template>
    <div>
      <div id="map" style="width: 100%; height: 400px;"></div>
      <button @click="startRecording" v-if="!recording">START</button>
      <button @click="stopRecording" v-if="recording">STOP</button>
      <button @click="dropMarker">(+)</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import 'ol/ol.css';
  import { Map, View } from 'ol';
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
  import { OSM, Vector as VectorSource } from 'ol/source';
  import { Style, Circle, Fill, Stroke } from 'ol/style';
  import { Point } from 'ol/geom';
  
  export default {
    name: 'Map',
    data() {
      return {
        map: null,
        recording: false,
        pathCoordinates: [],
        markers: [],
      };
    },
    mounted() {
      this.initializeMap();
      this.getLocation();
    },
    methods: {
      initializeMap() {
        this.map = new Map({
          target: 'map',
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: [0, 0],
            zoom: 2,
          }),
        });
      },

     getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.longitude, position.coords.latitude];
        const view = map.getView();
        view.setCenter(coords);
      },
      (error) => {
        console.error(error);
      },
      { timeout: 10000 }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
},
      startRecording() {
        this.recording = true;
        this.pathCoordinates = [];
        this.markers = [];
  
        this.map.on('click', this.recordCoordinate);
      },
      stopRecording() {
        this.recording = false;
        this.map.un('click', this.recordCoordinate);
  
        // Generate a static image of the map with the path and markers
        const canvas = document.createElement('canvas');
        const size = this.map.getSize();
        canvas.width = size[0];
        canvas.height = size[1];
  
        const context = canvas.getContext('2d');
        const mapElement = document.getElementById('map');
        const mapImage = new Image();
  
        mapImage.onload = () => {
          context.drawImage(mapImage, 0, 0);
  
          // Draw the path
          context.beginPath();
          context.strokeStyle = 'red';
          context.lineWidth = 2;
  
          const startPoint = this.pathCoordinates[0];
          context.moveTo(startPoint[0], startPoint[1]);
  
          for (let i = 1; i < this.pathCoordinates.length; i++) {
            const point = this.pathCoordinates[i];
            context.lineTo(point[0], point[1]);
          }
  
          context.stroke();
  
          // Draw the markers
          context.fillStyle = 'blue';
          context.strokeStyle = 'white';
  
          for (const marker of this.markers) {
            context.beginPath();
            context.arc(marker[0], marker[1], 6, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
          }
  
          // Save the image
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'map_with_path.png';
          link.click();
        };
  
        mapImage.src = this.map.getCanvas().toDataURL();
      },
      dropMarker(event) {
        if (this.recording) {
          const coordinate = this.map.getEventCoordinate(event);
          this.markers.push(coordinate);
        }
      },
      recordCoordinate(event) {
        if (this.recording) {
          const coordinate = this.map.getEventCoordinate(event);
          this.pathCoordinates.push(coordinate);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  #map {
    width: 100%;
    height: 400px;
  }
  </style>