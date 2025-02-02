<template>
  <div v-if="!isLoadingPopup" class="relative w-full max-w-6xl mx-auto">
    <!-- Main Content with Bing Wallpaper -->
    <img :src="getBingWallpaperUrlFromBase(currentWallpaper.url, false, false, false)" alt="Bing Wallpaper"
      class="w-full h-auto rounded-lg shadow-lg" />

    <!-- Overlay Text -->
    <div class="absolute top-5 left-5 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md">
      <h2 class="text-lg font-semibold">{{ currentWallpaper.title }}</h2>
      <p class="text-sm">{{ formatDate(currentWallpaper.datestring) }}</p>
    </div>

    <!-- Bottom Right Button -->
    <button @click="downloadWallpaper(currentWallpaper)"
      class="absolute bottom-5 right-5 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md hover:text-black transition">
      Download 4K
    </button>
  </div>
  <div v-if="isLoadingPopup" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-8 w-8 text-blue-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M14 2a10 10 0 0 1 0 20" />
      </svg>
      <p class="mt-4 text-xl font-semibold text-gray-700">Loading Wallpapers...</p>
    </div>
  </div>
  </template>
  
  <script setup>

  import { useWallpaperStore } from "~/stores/wallpaperStore";
  import { storeToRefs } from "pinia";
  import { onMounted } from 'vue';
  const route = useRoute();
  const store = useWallpaperStore();
  const {
    region,
    todayWallpaper,
    documents,
    fetchCollection,
    selectRegion,
    getBingWallpaperUrlFromBase,
    formatDate,
    fetchCollectionItem,
    downloadWallpaper,
    error,
    countryToRegionMap,
  } = store;
  
  onMounted(() => {
    
    fetchCollectionItem(route.params.date, route.params.region);
  });


const isLoadingPopup = computed(() => {
  return store.isLoadingPopup;
});

const isLoading = computed(() => {
  return store.isLoading;
})

const currentWallpaper = computed(() => {
  return store.currentWallpaper;
});

const regionToCountryMap = computed(() => {
  return store.regionToCountryMap;
});


useSeoMeta({
  title: 'Bing Wallpaper - ' + formatDate(route.params.date),
  description: 'HD image of Bing Wallpaper from ' + formatDate(route.params.date) + ' in ' + regionToCountryMap.value[route.params.region],
})


  </script>
  