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

      <div class="w-text-sm w-flex">
        <div class="vod-tags">
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
        </div>
        <div>
          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            class="p-button-rounded p-button-secondary p-button-sm p-button-text"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_tmenu"
          />
          <TieredMenu
            id="overlay_tmenu"
            ref="menu"
            :model="items"
            :popup="true"
            @click="menuToggleExec"
          >
          </TieredMenu>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Chip from "primevue/chip";
import dayjs from "dayjs/esm";
import duration from "dayjs/esm/plugin/duration";
import TieredMenu from "primevue/tieredmenu";
import { useApi } from "~/composables/useApi";
import { useToast } from "primevue/usetoast";

const toast = useToast();

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

const menu = ref();
const items = ref([
  {
    label: "Mark as Played",
  },
  {
    label: "Mark as Unplayed",
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const menuToggleExec = (event) => {
  switch (event.target.innerHTML) {
    case "Mark as Played":
      try {
        useApi(`/api/v1/playback/status`, {
          method: "POST",
          body: {
            vod_id: props.vod.id,
            status: "finished",
          },
          credentials: "include",
        });
        toast.add({
          severity: "success",
          summary: "Marked as Played",
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error marking as Played",
          life: 3000,
        });
        console.error("Error marking as played");
        console.error(error);
      }
      break;
    case "Mark as Unplayed":
      try {
        useApi(`/api/v1/playback/${props.vod.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        toast.add({
          severity: "success",
          summary: "Marked as Unplayed",
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error marking as Unplayed",
          life: 3000,
        });
        console.error("Error marking as unplayed");
        console.error(error);
      }
      break;
  }
};
</script>

<style lang="scss" scoped>
.vod-tags {
  margin-top: 0.4rem;
}
</style>
