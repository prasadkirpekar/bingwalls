<template>
  <div class="relative w-full max-w-6xl mx-auto">
    <!-- Left Hovering Country List -->
    <div
      class="fixed left-0 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-800 w-30 p-1 rounded-r-lg shadow-lg cursor-pointer transition-all duration-300">
      <ul class="space-y-2">
        <li v-for="(regionCode, country) in countryToRegionMap" :key="regionCode" @click="selectRegion(country)"
          class="cursor-pointer hover:bg-white px-2 py-1 rounded-md" :class="{ 'bg-white': region == regionCode }">
          {{ country }}
        </li>
      </ul>
    </div>
    <div v-if="isLoadingPopup || todayWallpaper == ''">
      <div role="status" style="height: 80vh;"
        class="flex items-center justify-center  w-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          fill="currentColor" viewBox="0 0 16 20">
          <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
          <path
            d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>

    </div>
    <div v-else>
      <!-- Main Content with Bing Wallpaper -->
      <img alt="Today's Bing Wallpaper" :src="getBingWallpaperUrlFromBase(todayWallpaper.url, false, false, false)"
        class="w-full h-auto sm:rounded-lg shadow-lg" />

      <!-- Overlay Text -->
      <div class="absolute top-5 left-5 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md">
        <h2 class="text-lg font-semibold">Today's Bing Wallpaper</h2>
        <p class="text-sm">{{ todayWallpaper.title }}</p>
      </div>

      <!-- Bottom Right Button -->
      <button @click="downloadWallpaper(todayWallpaper)"
        class="absolute bottom-5 right-5 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md hover:text-black transition">
        Download 4K
      </button>
    </div>

  </div>

  <section class="bg-white py-8">
    <div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
      <nav id="store" class="w-full  top-0 px-6 py-1">
        <div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3">
          <a class="tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl" href="#">
            More Wallpapers
          </a>
        </div>
      </nav>

      <!-- Display Wallpapers -->
      <div v-for="wallpaper in documents" :key="wallpaper.$id" class="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col">
        <NuxtLink
          :to="{ name: 'wallpaper-region-date', params: { region: wallpaper.region, date: wallpaper.datestring } }">
          <img  :alt="'Bing Wallpaper from ' + formatDate(wallpaper.datestring) + ' in ' + regionToCountryMap[wallpaper.region] + ' ' + wallpaper.title" class="hover:grow hover:shadow-lg rounded-lg w-full" :src="getBingWallpaperUrlFromBase(wallpaper.url, false)" />
          <div class="pt-3 flex items-center justify-between">
            <p>{{ wallpaper.title }}</p>
          </div>
          <p class="pt-1 text-gray-900">{{ formatDate(wallpaper.datestring) }}</p>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- Loading Spinner for Next Page -->
  <!-- <div v-if="isLoadingPopup" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-8 w-8 text-blue-500 mx-auto" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M14 2a10 10 0 0 1 0 20" />
      </svg>
      <p class="mt-4 text-xl font-semibold text-gray-700">Loading Wallpapers...</p>
    </div>
  </div> -->

  <!-- Loading Spinner for Next Page -->
  <div v-if="isLoading" class="text-center py-4">
    <svg class="animate-spin h-8 w-8 text-black-500 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M14 2a10 10 0 0 1 0 20" />
    </svg>
  </div>
</template>

<script setup>

useSeoMeta({
  title: 'Bing Wallpapers Archive',
  description: 'Collection of Bing Wallpapers from the last 10 years and multiple regions',
  ogTitle: 'Bing Wallpapers Archive',
  ogDescription: 'Collection of Bing Wallpapers from the last 10 years and multiple regions',
})


import { useWallpaperStore } from '@/stores/wallpaperStore';

const store = useWallpaperStore();

const {
  selectRegion,
  fetchCollection,
  getBingWallpaperUrlFromBase,
  formatDate,
  error,
  downloadWallpaper
} = store;

const isLoadingPopup = computed(() => {
  return store.isLoadingPopup;
});

const isLoading = computed(() => {
  return store.isLoading;
})

const todayWallpaper = computed(() => {
  return store.todayWallpaper;
})

const documents = computed(() => {
  return store.documents;
})

const countryToRegionMap = computed(() => {
  return store.countryToRegionMap;
});

const regionToCountryMap = computed(() => {
  return store.regionToCountryMap;
});


const region = computed(() => {
  return store.region;
});

const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
    
    fetchCollection();
  }
};

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

onMounted(() => {
  fetchCollection();  // Initial fetch
  window.addEventListener('scroll', handleScroll);
});
</script>