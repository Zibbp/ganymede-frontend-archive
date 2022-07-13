<template>
  <div
    class="w-bg-neutral-200 dark:w-bg-ganymede-900 dark:w-text-light-400 w-h-auto"
  >
    <div
      class="w-px-4 w-h-full w-py-3 sm:w-justify-between sm:w-items-center sm:w-flex sm:w-px-3 lg:w-px-64"
    >
      <div
        class="w-font-medium w-text-center sm:w-text-left w-flex w-flex-wrap"
      >
        <img
          :src="config.cdnURL + props.queue.edges.vod.web_thumbnail_path"
          class="w-w-150px"
          alt="VOD Thumbnail"
        />
        <div>
          <div class="w-ml-4 w-text-2xl">{{ props.queue.edges.vod.title }}</div>
          <div class="break"></div>
          <div class="w-ml-4 w-text-base">
            <span
              v-tooltip.top="'External ID'"
              class="hover:w-bg-neutral-400"
              >{{ props.queue.edges.vod.ext_id }}</span
            >
            •
            <span
              v-tooltip.top="'Ganymede ID'"
              class="hover:w-bg-neutral-400"
              >{{ props.queue.edges.vod.id }}</span
            >
          </div>
          <div class="break"></div>
          <div class="w-ml-4 w-text-base">
            <span
              v-tooltip.top="'Streamed At'"
              class="hover:w-bg-neutral-400"
              >{{
                dayjs(props.queue.edges.vod.streamed_at).format("YYYY/MM/DD")
              }}</span
            >
          </div>
        </div>
      </div>

      <div class="w-font-medium">
        <div class="w-flex w-flex-wrap">
          <div class="w-flex">
            <span
              class="custom-marker shadow-2"
              :class="props.queue.live_archive ? 'style-false' : 'style-true'"
              ><i
                v-if="props.queue.live_archive == true"
                class="pi pi-check-circle"
              ></i>
              <i v-else class="pi pi-times-circle"></i
            ></span>
            <span class="w-ml-1">Live Archive</span>
          </div>
          <div class="w-mt-2 break"></div>
          <div class="w-flex">
            <span
              class="custom-marker shadow-2"
              :class="props.queue.processing ? 'style-false' : 'style-true'"
              ><i
                v-if="props.queue.processing == true"
                class="pi pi-check-circle"
              ></i>
              <i v-else class="pi pi-times-circle"></i
            ></span>
            <span class="w-ml-1">Processing</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs/esm";
import Image from "primevue/image";
const config = useRuntimeConfig().public;

const props = defineProps({
  queue: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.break {
  flex-basis: 100%;
  height: 0;
}
.custom-marker {
  display: flex;
  width: 1.5rem;
  height: 1.5rem;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border-radius: 50%;
  z-index: 1;
}
.style-true {
  background-color: #ff0000;
}
.style-false {
  background-color: #10b981;
}
</style>
