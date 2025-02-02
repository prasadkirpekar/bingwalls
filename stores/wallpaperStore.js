// stores/wallpaperStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { databases } from '@/services/appwrite';
import { Query } from 'appwrite';

export const useWallpaperStore = defineStore('wallpaper', () => {
  const countryToRegionMap = {
    "🌐 Worldwide": "en-SG",
    "🇦🇺 Australia": "en-AU",
    "🇧🇷 Brazil": "pt-BR",
    "🇨🇦 Canada": "en-CA",
    "🇨🇳 China": "zh-CN",
    "🇫🇷 France": "fr-FR",
    "🇩🇪 Germany": "de-DE",
    "🇮🇳 India": "en-IN",
    "🇯🇵 Japan": "ja-JP",
    "🇺🇸 USA": "en-US",
    "🇬🇧 U.K.": "en-GB",
  };

  const regionToCountryMap = {
    "en-SG": "Worldwide",
    "en-AU": "Australia",
    "pt-BR": "Brazil",
    "en-CA": "Canada",
    "zh-CN": "China",
    "fr-FR": "France",
    "de-DE": "Germany",
    "en-IN": "India",
    "ja-JP": "Japan",
    "en-US": "USA",
    "en-GB": "U.K.",
  };



  const region = ref('en-SG');
  const todayWallpaper = ref('');
  const currentWallpaper = ref('');
  const documents = ref([]);
  const isLoading = ref(false);
  const isLoadingPopup = ref(false);
  const lastFetchedDocumentId = ref(null);
  const error = ref(null);

  const collectionId = 'archives';
  const databaseId = '64d3782b0ecf2c5c6d9b';
  const BING_URL = "https://www.bing.com";

  const fetchCollection = async () => {
    if (isLoadingPopup.value || isLoading.value) return;
    try {
      isLoading.value = true;
      isLoadingPopup.value = true;
      let query = [
        Query.equal('region', region.value), 
        Query.orderDesc('datestring'),
        Query.limit(20)
      ];

      if (lastFetchedDocumentId.value) {
        query.push(Query.cursorAfter(lastFetchedDocumentId.value));
      }

      const response = await databases.listDocuments(databaseId, collectionId, query);
      documents.value.push(...response.documents);
      lastFetchedDocumentId.value = response.documents[response.documents.length - 1]?.$id;
      if (todayWallpaper.value == '') todayWallpaper.value = response.documents[0];
    } catch (err) {
      error.value = err.message;
      console.error('Error:', err);
    } finally {
      isLoadingPopup.value = false;
      isLoading.value = false;
    }
  };

  const fetchCollectionItem = async (dateString, region) => {
    try {
        isLoadingPopup.value = true;
        let query = [Query.equal('region', region), Query.equal('datestring', dateString)];
        const response = await databases.listDocuments(databaseId, collectionId, query);
        if (response.documents.length > 0) {
            currentWallpaper.value = response.documents[0];
        }
      } catch (err) {
        error.value = err.message;
        console.error('Error:', err);
      } finally {
        isLoadingPopup.value = false;
      }
  };

  const selectRegion = (country) => {
    region.value = countryToRegionMap[country];
    lastFetchedDocumentId.value = null;
    todayWallpaper.value = '';
    documents.value = [];
    fetchCollection();
  };

  const getWallpaperResolution = (isPortrait = false, isHD = false, isThumbnail=true) => {
    if (isThumbnail) {
      return "_400x240.jpg";
    }
    return isHD ? "_UHD.jpg" : (isPortrait ? "_1080x1920.jpg" : "_1920x1080.jpg");
  };

  const getBingWallpaperUrlFromBase = (baseUrl, isPortrait = false, isHD = false, isThumbnail = true) => {
    let url = baseUrl + getWallpaperResolution(isPortrait, isHD, isThumbnail);
    return url.includes(BING_URL) ? url : BING_URL + url;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[parseInt(month) - 1];
    return `${monthName} ${parseInt(day)}, ${year}`;
  };

  function downloadWallpaper(wallpaper) {
    const wallpaperUrl = getBingWallpaperUrlFromBase(wallpaper.url, false, true);
    window.open(wallpaperUrl, '_blank');
  }

  return {
    region,
    todayWallpaper,
    documents,
    isLoading,
    isLoadingPopup,
    fetchCollection,
    selectRegion,
    getBingWallpaperUrlFromBase,
    formatDate,
    fetchCollectionItem,
    downloadWallpaper,
    error,
    countryToRegionMap,
    regionToCountryMap,
    currentWallpaper,
    formatDate,
  };
});