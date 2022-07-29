<template>
  <div>
    <PlaylistHeader :playlist="playlist" />
    <div class="w-container w-mx-auto">
      <SearchSection :vods="playlist.edges.vods" />
    </div>
  </div>
</template>

<script setup>
import { useApi } from "~/composables/useApi";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const route = useRoute();
const config = useRuntimeConfig().public;

const { data: playlist } = await useAsyncData(
  `playlist-${route.params.id}`,
  async () => {
    try {
      return await useApi(`/api/v1/playlist/${route.params.id}`, {
        method: "GET",
      });
    } catch (error) {
      console.error("Error fetching playlist: ", error);
      toast.add({
        severity: "error",
        summary: "Error fetching playlist",
        detail: error.response._data.message,
        life: 3000,
      });
      navigateTo(`/playlists`);
    }
  }
);
</script>

<style lang="scss" scoped></style>
