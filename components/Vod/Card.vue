<template>
  <div class="col-12 md:col-2">
    <NuxtLink v-if="!vod.processing" :to="'/vods/' + props.vod.id">
      <div class="vod-grid-item card">
        <div class="vod-grid-item-content">
          <div class="img-container">
            <div v-show="isImageLoaded">
              <span
                title="Duration"
                class="w-px-1 w-py-1 w-mt-3 w-ml-1 w-text-xs w-text-white vod-badge w-rounded-sm"
              >
                {{ formmatedDuration }}
              </span>
              <img
                @load="imageLoaded"
                class="border-round-sm !w-inline"
                :src="config.cdnURL + props.vod.web_thumbnail_path"
                :alt="props.vod.name"
              />
              <i
                v-if="statusIsFinished"
                title="Marked as Played"
                class="pi pi-check w-absolute vod-marked-finished"
              ></i>
              <ProgressBar
                v-if="hasProgress"
                :value="progressbarValue"
                :showValue="false"
              />
              <div
                title="Streamed At"
                class="w-px-1 w-py-1 w-text-xs w-text-white vod-duration-badge w-rounded-sm"
              >
                {{ dayjs(props.vod.streamed_at).format("YYYY/MM/DD") }}
              </div>
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
          <div v-show="isImageLoaded">
            <span
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
          </div>
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
import ProgressBar from "primevue/progressbar";

import { toRaw } from "vue";

const config = useRuntimeConfig().public;

dayjs.extend(duration);

const props = defineProps({
  vod: {
    type: Object,
    required: true,
  },
  playback: {
    type: Array,
    required: false,
  },
});

const formmatedDuration = ref();
const hasProgress = ref(false);
const progressbarValue = ref(0);
const statusIsFinished = ref(false);

onMounted(() => {
  formmatedDuration.value = dayjs
    .duration(props.vod.duration, "seconds")
    .format("HH:mm:ss");

  // Playback progress
  if (props.playback) {
    const playbackEnts = toRaw(props.playback);
    // Find the current vod in array of user's playback stats
    const foundPlaybackEnt = playbackEnts.find(
      (p) => p.vod_id === props.vod.id
    );
    if (foundPlaybackEnt) {
      hasProgress.value = true;
      // Check if VOD is finished
      if (foundPlaybackEnt.status == "finished") {
        statusIsFinished.value = true;
        hasProgress.value = false;
        return;
      }
      // Calculate the percent of progress
      const rawPercent = (foundPlaybackEnt.time / props.vod.duration) * 100;
      progressbarValue.value = parseInt(rawPercent);
    }
  }
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
  background: rgb(211, 0, 0);
  background: rgba(211, 0, 0, 0.5);
  color: #f1f1f1;
  width: 100%;
  text-align: center;
}
.p-progressbar {
  height: 0.25rem;
  margin-top: -0.75rem;
  margin-bottom: 0.5rem;
}
.vod-marked-finished {
  top: 0;
  right: 0;
  margin-top: 0.75rem;
  margin-right: 0.25rem;
  padding: 0.25rem;
  border-radius: 6px;
  color: white;
  background-color: #22c55e;
}
</style>
