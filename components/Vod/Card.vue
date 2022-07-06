<template>
  <div class="col-12 md:col-2">
    <NuxtLink :to="'/vods/' + props.vod.id">
      <div class="vod-grid-item card">
        <div class="vod-grid-item-content">
          <div>
            <span
              v-show="isImageLoaded"
              class="w-px-1 w-py-1 w-mt-3 w-ml-1 w-text-xs w-text-white vod-badge w-rounded-sm"
            >
              {{ dayjs(props.vod.created_at).format("YYYY/MM/DD") }}
            </span>
            <img
              v-show="isImageLoaded"
              @load="imageLoaded"
              class="border-round-sm !w-inline"
              :src="config.cdnURL + props.vod.web_thumbnail_path"
              :alt="props.vod.name"
            />
            <Skeleton
              v-show="!isImageLoaded"
              class="border-round-sm"
              width="100%"
              height="163px"
            />
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
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import dayjs from "dayjs/esm";

const config = useRuntimeConfig().public;

const props = defineProps({
  vod: {
    type: Object,
    required: true,
  },
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
</style>
