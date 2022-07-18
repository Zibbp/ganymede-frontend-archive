<template>
  <div class="w-h-full w-w-full">
    <div
      class="w-px-4 w-h-full w-py-3 sm:w-justify-between sm:w-items-center sm:w-flex sm:w-px-3 lg:w-px-4 dark:w-text-light-400 w-text-dark-300"
    >
      <p class="w-font-medium w-text-center sm:w-text-left">
        <span>{{ props.vod.edges.channel.display_name }}</span>
        <span class="w-border-l-2 w-border-gray-200 w-py-2 w-ml-4 w-pl-4">
          {{ props.vod.title }}
        </span>
      </p>

      <span class="w-text-sm">
        <Chip
          class="w-ml-2"
          :label="props.vod.type.toUpperCase()"
          title="Archive Type"
        />
        <Chip
          class="w-ml-2"
          :label="views"
          title="View Count"
          icon="pi pi-users"
        />
        <Chip
          class="w-ml-2"
          :label="formmatedDuration"
          title="Duration"
          icon="pi pi-clock"
        />
        <Chip
          v-if="props.vod.streamed_at"
          class="w-ml-2"
          :label="formattedStreamedAt"
          title="Streamed At"
          icon="pi pi-calendar"
        />
      </span>
    </div>
  </div>
</template>

<script setup>
import Chip from "primevue/chip";
import dayjs from "dayjs/esm";
import duration from "dayjs/esm/plugin/duration";
const props = defineProps({
  vod: {
    type: Object,
    required: true,
  },
});

dayjs.extend(duration);

const formattedStreamedAt = ref();
const formmatedDuration = ref();
const views = ref(1);

if (props.vod.views > 0) {
  views.value = props.vod.views.toLocaleString();
}

onMounted(() => {
  formattedStreamedAt.value = dayjs(props.vod.streamed_at).format("YYYY/MM/DD");
  formmatedDuration.value = dayjs
    .duration(props.vod.duration, "seconds")
    .format("HH:mm");
});
</script>

<style lang="scss" scoped></style>
