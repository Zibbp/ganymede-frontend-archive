<template>
  <div>
    <Timeline
      :value="customTimelineData"
      align="left"
      class="customized-timeline"
    >
      <template #marker="slotProps">
        <span
          v-if="slotProps.item.status == 'success'"
          class="custom-marker shadow-2"
          :style="{ backgroundColor: '#10b981' }"
        >
          <i class="pi pi-check"></i>
        </span>
        <span
          v-if="slotProps.item.status == 'running'"
          class="custom-marker shadow-2"
          :style="{ backgroundColor: '#3b82f6' }"
        >
          <i class="icon-spin pi pi-spinner"></i>
        </span>
        <span
          v-if="slotProps.item.status == 'pending'"
          class="custom-marker shadow-2"
          :style="{ backgroundColor: '#a3a3a3' }"
        >
          <i class="pi pi-clock"></i>
        </span>
        <span
          v-if="slotProps.item.status == 'failed'"
          class="custom-marker shadow-2"
          :style="{ backgroundColor: '#dc2626' }"
        >
          <i class="pi pi-times-circle"></i>
        </span>
      </template>
      <template #content="slotProps">
        <i
          @click="confirmStepRestart(slotProps.item.json_name)"
          v-tooltip.top="'Restart Step'"
          class="pi pi-refresh w-cursor-pointer w-mr-2"
        ></i>
        <span>{{ slotProps.item.name }} </span>
      </template>
    </Timeline>
  </div>
</template>

<script setup>
import Timeline from "primevue/timeline";
const { $bus } = useNuxtApp();

const props = defineProps({
  queue: {
    type: Object,
    required: true,
  },
});

const customTimelineData = ref([
  {
    name: "Create Folder",
    status: props.queue.task_vod_create_folder,
    json_name: "vod_create_folder",
  },
  {
    name: "Download Thumbnail",
    status: props.queue.task_vod_download_thumbnail,
    json_name: "vod_download_thumbnail",
  },
  {
    name: "Save Info",
    status: props.queue.task_vod_save_info,
    json_name: "vod_save_info",
  },
]);

const confirmStepRestart = (stepName) => {
  $bus.$emit("show-restart-dialog", {
    task: stepName,
  });
};
</script>

<style lang="scss" scoped>
.custom-marker {
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border-radius: 50%;
  z-index: 1;
}

.icon-spin {
  animation-name: spin;
  animation-duration: 4000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

::v-deep(.p-timeline-event-content) ::v-deep(.p-timeline-event-opposite) {
  line-height: 1;
}

@media screen and (max-width: 960px) {
  ::v-deep(.customized-timeline) {
    .p-timeline-event:nth-child(even) {
      flex-direction: row !important;

      .p-timeline-event-content {
        text-align: left !important;
      }
    }

    .p-timeline-event-opposite {
      flex: 0;
    }

    .p-card {
      margin-top: 1rem;
    }
  }
}
</style>
