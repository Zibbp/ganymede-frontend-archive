<template>
  <div>
    <VodHeader :name="channel.display_name" />
    <div class="w-container w-mx-auto">
      <div v-if="pending">Loading Vods...</div>
      <div v-else>
        <VodSection :vods="vods" :playback="playback"></VodSection>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApi } from "~/composables/useApi";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const route = useRoute();
const config = useRuntimeConfig().public;

useHead({
  title: `${route.params.name}`,
});

let channel;

try {
  channel = await useApi(`/api/v1/channel/name/${route.params.name}`, {
    method: "GET",
    credentials: "include",
  });
} catch (error) {
  console.error("Error fetching channel: ", error);
  toast.add({
    severity: "error",
    summary: "Error fetching channel",
    detail: error.response.data.message,
    life: 3000,
  });
}

useHead({
  title: `${channel.display_name} - Ganymede`,
});

const {
  data: vods,
  pending,
  refresh,
} = await useLazyAsyncData(`vods-${channel.id}`, () => {
  try {
    return useApi(`/api/v1/vod?channel_id=${channel.id}`, {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Error fetching vods: ", error);
    toast.add({
      severity: "error",
      summary: "Error fetching vods",
      detail: error.response.data.message,
      life: 3000,
    });
  }
});

const { data: playback } = await useLazyAsyncData(
  `playback-${channel.id}`,
  () => {
    try {
      return useApi(`/api/v1/playback`, {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error fetching playback: ", error);
      toast.add({
        severity: "error",
        summary: "Error fetching playback",
        detail: error.response.data.message,
        life: 3000,
      });
    }
  }
);
</script>

<style lang="scss" scoped></style>
