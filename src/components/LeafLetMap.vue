<template>
  <div class="flex flex-col items-center p-4 w-full h-full">
    <div ref="mapContainer" class="w-full" style="height: 70vh" id="map" />
    
  </div>
  <button @click="startRecording" class=""> START </button> 
    <div class="mb-4"> 
        <button @click="stopRecording" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"> STOP</button> 
        <button @click="addMarker" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"> (+) </button> </div>
    <div class="text-xl mb-2">{{ lat }}, {{ lng }}</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import L from "leaflet";
import html2canvas from "html2canvas";

const lat = ref(0);
const lng = ref(0);
const map = ref();
const mapContainer = ref();
const recording = ref(false);
const path = [];

onMounted(() => {
  map.value = L.map(mapContainer.value); 
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value);
  getLocation();
  addMarker();
});

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      lat.value = position.coords.latitude; // getPosition
      lng.value = position.coords.longitude;
      map.value.setView([lat.value, lng.value], 13);

      if (recording.value) {
        path.push([lat.value, lng.value]);
        drawPath();
      }
    });
  }
};


const startRecording = () => {
  recording.value = true;
  path.length = 0; // Clear previous path
  addMarker(); // add first marker
  getLocation();
};

const stopRecording = () => {
  recording.value = false;
  drawPath();
  addMarker();
  captureMap();
  clearMarkers()
};

const addMarker = () => {
  L.marker([lat.value, lng.value])
    .addTo(map.value)
    .on("dragend", (event) => {
      console.log(event);
    });
};

const drawPath = () => {
  if (path.length > 1) {
    const polyline = L.polyline(path, { color: "green" }).addTo(map.value);
    map.value.fitBounds(polyline.getBounds());
  }
};

const clearMarkers = () => {
  map.value.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer);
    }
  });
};

const captureMap = async () => {
  const mapContainerElement = mapContainer.value;
  html2canvas(mapContainerElement).then((canvas) => {
    const image = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = image;
    link.download = 'map_capture.png';
    link.click();
  });
};
</script>

<style scoped></style>