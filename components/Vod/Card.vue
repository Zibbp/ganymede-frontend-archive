<template>
  <div class="col-12 md:col-2">
    <NuxtLink v-if="!vod.processing" :to="'/vods/' + props.vod.id">
      <div class="vod-grid-item card">
        <div class="vod-grid-item-content">
          <div class="img-container">
            <span
              v-show="isImageLoaded"
              title="Duration"
              class="w-px-1 w-py-1 w-mt-3 w-ml-1 w-text-xs w-text-white vod-badge w-rounded-sm"
            >
              {{ formmatedDuration }}
            </span>
            <img
              v-show="isImageLoaded"
              @load="imageLoaded"
              class="border-round-sm !w-inline"
              :src="config.cdnURL + props.vod.web_thumbnail_path"
              :alt="props.vod.name"
            />
            <div
              v-show="isImageLoaded"
              title="Streamed At"
              class="w-px-1 w-py-1 w-text-xs w-text-white vod-duration-badge w-rounded-sm"
            >
              {{ dayjs(props.vod.streamed_at).format("YYYY/MM/DD") }}
            </div>
            <div v-show="!isImageLoaded">
              <Skeleton class="border-round-sm" width="100%" height="163px" />
            </div>
          </div>
          <div
            class="vod-name w-text-neutral-700 !w-text-base w-line-clamp-2 dark:w-text-neutral-200"
            :title="props.vod.title"
          >
            {{ props.vod.title }}
          </div>
        </div>
      </div>
    </NuxtLink>
    <div v-else class="vod-grid-item card">
      <div class="vod-grid-item-content">
        <div class="img-container">
          <span
            v-show="isImageLoaded"
            title="Duration"
            class="w-px-1 w-py-1 w-mt-3 w-ml-1 w-text-xs w-text-white vod-badge w-rounded-sm"
          >
            {{ formmatedDuration }}
          </span>
          <img
            v-show="isImageLoaded"
            @load="imageLoaded"
            class="border-round-sm !w-inline"
            :src="config.cdnURL + props.vod.web_thumbnail_path"
            :alt="props.vod.name"
          />
          <div v-show="!isImageLoaded">
            <Skeleton
              v-show="!isImageLoaded"
              class="border-round-sm"
              width="100%"
              height="163px"
            />
          </div>

          <div
            v-show="isImageLoaded"
            title="Streamed At"
            class="w-px-1 w-py-1 w-text-xs w-text-white vod-duration-badge w-rounded-sm"
          >
            {{ dayjs(props.vod.streamed_at).format("YYYY/MM/DD") }}
          </div>
          <div class="w-bg-red-600 overlay w-mb-2">PROCESSING</div>
        </div>
        <div
          class="vod-name w-text-neutral-700 !w-text-base w-line-clamp-2 dark:w-text-neutral-200"
          :title="props.vod.title"
        >
          {{ props.vod.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import dayjs from "dayjs/esm";
import duration from "dayjs/esm/plugin/duration";

const config = useRuntimeConfig().public;

dayjs.extend(duration);

const props = defineProps({
  vod: {
    type: Object,
    required: true,
  },
});

const formmatedDuration = ref();

onMounted(() => {
  formmatedDuration.value = dayjs
    .duration(props.vod.duration, "seconds")
    .format("HH:mm");
});

const isImageLoaded = ref(false);
const imageLoaded = () => {
  isImageLoaded.value = true;
};
</script>

<style lang="scss" scoped>
.vod-badge {
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
}
.vod-duration-badge {
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  margin-top: -2.3rem;
  right: 0;
  margin-right: 0.25rem;
}
.img-container {
  position: relative;
  width: 100%;
}
.overlay {
  position: absolute;
  bottom: 0;
  background: rgb(148, 0, 211);
  background: rgba(148, 0, 211, 0.5);
  color: #f1f1f1;
  width: 100%;
  text-align: center;
}
</style>
