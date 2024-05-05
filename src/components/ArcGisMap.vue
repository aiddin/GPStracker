<template>
  <div>
    <div ref="map" class="map"></div>
    <button @click="startRecording">START</button>
    <button @click="stopRecording">STOP</button>
    <button @click="addMarker">(+)</button>
  </div>
</template>

<script>
import { loadModules } from 'esri-loader';

export default {
  data() {
    return {
      map: null, 
      isRecording: false,
      path: [], 
      markers: [], 
    };
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap() {
      loadModules(['esri/map', 'esri/geometry/Point', 'esri/symbols/SimpleMarkerSymbol', 'esri/graphic', 'esri/geometry/webMercatorUtils'])
        .then(([Map, Point, SimpleMarkerSymbol, Graphic, webMercatorUtils]) => {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = webMercatorUtils.geographicToWebMercator(new Point(longitude, latitude));
            this.map = new Map(this.$refs.map, {
              center: userLocation,
              zoom: 12,
              basemap: 'gray',
            });

            // Add a marker for the user's location
            const markerSymbol = new SimpleMarkerSymbol().setColor('#FF0000');
            const markerGraphic = new Graphic(userLocation, markerSymbol);
            this.map.graphics.add(markerGraphic);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    startRecording() {
      this.isRecording = true;
      this.path = []; // Clear the previously recorded path
    },
    stopRecording() {
      this.isRecording = false;
      // Take a screenshot of the map and save it locally with start and end markers
      const screenshot = this.takeScreenshot();
      // Save the recorded path and markers along with the screenshot
      this.saveRecording(screenshot);
    },
    addMarker() {
      if (this.isRecording) {
        // Get the current map center as the marker location
        const markerLocation = this.map.extent.getCenter();
        this.markers.push(markerLocation); // Add the marker location to the markers array
      }
    },
    takeScreenshot() {
      // Placeholder logic for capturing a screenshot
      const screenshot = 'screenshot.png'; // Replace with captured screenshot image data or file path
      return screenshot;
    },
    saveRecording(screenshot) {
      // Placeholder logic for saving the recording
      const recording = {
        path: this.path,
        markers: this.markers,
        screenshot: screenshot,
      };
      console.log(recording); // Replace with logic to save the recording locally
    },
  },
};
</script>

<style>
/* esri styles */
@import url('https://js.arcgis.com/3.23/esri/css/esri.css');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>