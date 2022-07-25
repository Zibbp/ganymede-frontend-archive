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
      <SearchSection v-if="searchComplete" :vods="vods"></SearchSection>
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
    searchComplete.value = true;
  } catch (error) {
    console.error("Error searching vods: " + error);
  }
};
</script>

<style lang="scss" scoped></style>
