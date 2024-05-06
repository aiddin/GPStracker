<template>
    <div>
      <GoogleMap  id="map"
      api-key="AIzaSyBlUfgGLBFqjvv_NBCxxAsD7-HoIfE3l0w"
      style="width: 100%; height: 500px"
        :center="center"
        :zoom="15"
        @click="recordPath"
      >
        <Marker :options="{ position: center }" />
        <Marker v-for="marker in markers" :key="marker.id" :options="{ position: marker.position }" />
      </GoogleMap>
      <button @click="startRecording" :disabled="isRecording">START</button>
      <button @click="stopRecording" :disabled="!isRecording">STOP</button>
      <button @click="addMarker" :disabled="!isRecording">+</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { GoogleMap, Marker } from 'vue3-google-map';
  import html2canvas from "html2canvas";

  const center = ref({ lat: 0, lng: 0 });
  const path = ref([]);
  const markers = ref([]);
  const isRecording = ref(false);
  
  const startRecording = () => {
    isRecording.value = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPoint = { lat: latitude, lng: longitude };
        path.value.push(newPoint);
        center.value.lat = latitude;
        center.value.lng = longitude;
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };
  
  const stopRecording = () => {
    isRecording.value = false;
    captureMap()
    path.value = [];
    markers.value = [];
  };
  
  const addMarker = (event) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPoint = { lat: latitude, lng: longitude };
        path.value.push(newPoint);
        center.value.lat = latitude;
        center.value.lng = longitude;
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    const newMarker = { id: markers.value.length + 1, position: { lat:  center.value.lat, lng: center.value.lng } };
    markers.value.push(newMarker);
  };

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
  
  onMounted(() => {
    startRecording();
  });
  </script>