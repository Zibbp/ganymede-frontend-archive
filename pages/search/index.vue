<template>
  <div class="w-container w-mx-auto">
    <div class="w-text-center w-mt-4">
      <div class="w-w-1/2 w-mx-auto">
        <form @submit.prevent="searchVods()">
          <div class="p-inputgroup">
            <InputText
              placeholder="Search"
              v-model="searchText"
              type="text"
              required
            />
            <Button
              icon="pi pi-search"
              class="p-button-primary"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
    <div>
      <SearchSection
        v-if="searchComplete"
        :vods="vods"
        :playback="playbackResp"
      ></SearchSection>
    </div>
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import { useApi } from "~/composables/useApi";

const route = useRoute();

useHead({
  title: "Search - Ganymede",
});

const searchComplete = ref(false);
const searchText = ref();
const vods = ref();
const playbackResp = ref();

onMounted(() => {
  if (route.query.q) {
    // Query was used to search for vods
    searchText.value = route.query.q;
    searchVods();
  }
});

const searchVods = async () => {
  searchComplete.value = false;
  searchText.value = searchText.value.trim();
  try {
    const vodsSearch = await useApi(
      `/api/v1/vod/search?q=${searchText.value}`,
      {
        method: "GET",
      }
    );
    vods.value = vodsSearch;

    // Playback progress
    const { data: playback } = await useLazyAsyncData(
      `search-playback-${searchText.value}`,
      () => {
        try {
          return useApi(
            `/api/v1/playback`,
            {
              method: "GET",
              credentials: "include",
            },
            true
          );
        } catch (error) {
          console.debug(
            "Error fetching progress data, no playback data probably exists."
          );
          console.debug(error);
        }
      }
    );
    playbackResp.value = playback.value;

    searchComplete.value = true;
  } catch (error) {
    console.error("Error searching vods: " + error);
  }
};
</script>

<style lang="scss" scoped></style>
