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
        <div v-if="authStore.isAuthenticated">
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
    <!-- Playlist -->
    <Dialog
      v-model:visible="editPlaylistDialog"
      :style="{ width: '450px' }"
      header="Edit VOD Playlists"
      :modal="true"
      class="p-fluid"
    >
      <div v-if="vodPlaylists">
        <div class="w-text-xl w-mb-1 w-font-bold">In Playlists:</div>
        <div v-for="playlist in vodPlaylists" class="w-py-1">
          <span
            @click="removePlaylist(playlist.id)"
            class="hover:w-line-through hover:w-decoration-red-500 w-cursor-pointer"
            >{{ playlist.name }}</span
          >
        </div>
      </div>

      <div class="w-mt-2">
        <div class="w-text-xl w-font-bold">Add to Playlist</div>

        <Dropdown
          v-model="selectedPlaylist"
          :options="playlists"
          :filter="true"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a Playlist"
        />
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="editPlaylistDialog = false"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="savePlaylist"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import Chip from "primevue/chip";
import dayjs from "dayjs/esm";
import duration from "dayjs/esm/plugin/duration";
import TieredMenu from "primevue/tieredmenu";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import { useAuthStore } from "~/stores/AuthStore";

import { useApi } from "~/composables/useApi";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const authStore = useAuthStore();

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
    label: "Mark as Watched",
  },
  {
    label: "Mark as Unwatched",
  },
  {
    label: "Add to Playlist",
  },
]);
const editPlaylistDialog = ref(false);
const vodPlaylists = ref();
const playlists = ref();
const selectedPlaylist = ref();

const toggle = (event) => {
  menu.value.toggle(event);
};

const fetchVodPlaylists = async () => {
  const vPlaylists = await useApi(`/api/v1/vod/${props.vod.id}/playlist`, {
    method: "GET",
  });
  vodPlaylists.value = vPlaylists;
};

const menuToggleExec = async (event) => {
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
          summary: "Marked as Watched",
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error marking as Watched",
          life: 3000,
        });
        console.error("Error marking as Watched");
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
          summary: "Marked as Unwatched",
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error marking as Unwatched",
          life: 3000,
        });
        console.error("Error marking as Unwatched");
        console.error(error);
      }
      break;
    case "Add to Playlist":
      try {
        fetchVodPlaylists();
        const allPlaylists = await useApi(`/api/v1/playlist`, {
          method: "GET",
        });
        playlists.value = allPlaylists;
        editPlaylistDialog.value = true;
        6;
        break;
      } catch (error) {
        console.error("Error fetching VOD playlists");
        console.error(error);
        toast.add({
          severity: "error",
          summary: "Error fetching VOD playlists",
          life: 3000,
        });
        break;
      }
  }
};

const savePlaylist = async () => {
  if (selectedPlaylist.value) {
    try {
      await useApi(`/api/v1/playlist/${selectedPlaylist.value}`, {
        method: "POST",
        body: {
          vod_id: props.vod.id,
        },
        credentials: "include",
      });
      toast.add({
        severity: "success",
        summary: "Added to Playlist",
        life: 3000,
      });
      selectedPlaylist.value = null;
      editPlaylistDialog.value = false;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error adding to Playlist",
        detail: error.response._data.message,
        life: 3000,
      });
      console.error("Error adding to Playlist");
      console.error(error);
    }
  } else {
    editPlaylistDialog.value = false;
  }
};

const removePlaylist = async (playlistID) => {
  try {
    await useApi(`/api/v1/playlist/${playlistID}/vod`, {
      method: "DELETE",
      body: {
        vod_id: props.vod.id,
      },
      credentials: "include",
    });
    fetchVodPlaylists();
    toast.add({
      severity: "success",
      summary: "Removed from Playlist",
      life: 3000,
    });
  } catch (error) {
    console.error("Error removing from playlist");
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Error removing from playlist",
      life: 3000,
    });
  }
};
</script>

<style lang="scss" scoped>
.vod-tags {
  margin-top: 0.4rem;
}
</style>
