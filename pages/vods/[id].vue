<template>
  <div>
    <div class="w-grid w-grid-cols-12">
      <div
        class="w-full vod-player-section"
        :class="
          vod.chat_video_path
            ? 'w-col-span-12 sm:w-col-span-12 md:w-col-span-12 lg:w-col-span-10 xl:w-col-span-10 2xl:w-col-span-10'
            : 'w-col-span-12'
        "
      >
        <VodVideoPlayer :vod="vod" :progress="progress" />
      </div>

      <div
        v-if="vod.chat_video_path"
        class="w-col-span-12 sm:w-col-span-12 md:w-col-span-12 lg:w-col-span-2 xl:w-col-span-2 2xl:w-col-span-2 w-full vod-player-section"
      >
        <VodChatPlayer :vod="vod" />
      </div>
    </div>
    <div class="vod-title-section">
      <VodTitle :vod="vod" />
    </div>
  </div>
</template>

<script setup>
import { useApi } from "~/composables/useApi";
const route = useRoute();
const config = useRuntimeConfig().public;

const { data: vod } = await useAsyncData(
  `vod-${route.params.id}`,
  async () =>
    await useApi(`/api/v1/vod/${route.params.id}?with_channel=true`, {
      method: "GET",
      credentials: "include",
    })
);

useHead({
  title: `${vod.value.title}`,
});

const { data: progress } = await useAsyncData(
  `progress-${route.params.id}`,
  async () => {
    try {
      return await useApi(`/api/v1/playback/${route.params.id}`, {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      // No playback data found, do nothing.
    }
  }
);
</script>

<style lang="scss" scoped>
.vod-player-section {
  min-height: calc(100vh - 8.2rem);
  height: calc(100vh - 8.2rem);
  max-height: calc(100vh - 8.2rem);
}
.vod-title-section {
  height: 4rem;
}
</style>
