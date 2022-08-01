<template>
  <div>
    <PlaylistHeader :playlist="playlist" />
    <div v-if="editorOrAdmin" class="w-flow-root w-m-1">
      <div class="speeddial-linear">
        <SpeedDial showIcon="pi pi-pencil" :model="items" direction="left" />
      </div>
    </div>
    <div class="w-container w-mx-auto">
      <SearchSection :vods="playlist.edges.vods" />
    </div>
    <!-- Edit Playlist Dialog -->
    <Dialog
      v-model:visible="editPlaylistDialog"
      :style="{ width: '450px' }"
      header="Edit Playlist"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Name</label>
        <InputText id="name" v-model.trim="playlist.name" required="true" />
      </div>

      <div class="field">
        <label for="name">Description</label>
        <InputText
          id="desc"
          v-model.trim="playlist.description"
          required="true"
        />
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="editPlaylist"
        />
      </template>
    </Dialog>
    <!-- Delete playlist dialog -->
    <Dialog
      v-model:visible="deletePlaylistDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <div>
          Are you sure you want to delete playlist
          <b>{{ playlist.name }}</b
          >?
        </div>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deletePlaylistDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deletePlaylist"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import SpeedDial from "primevue/speeddial";
import Dialog from "primevue/dialog";

import { useApi } from "~/composables/useApi";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "~/stores/AuthStore";

const toast = useToast();
const route = useRoute();
const config = useRuntimeConfig().public;
const authStore = useAuthStore();

useHead({
  title: "Playlist - Ganymede",
});

const { data: playlist, refresh } = await useAsyncData(
  `playlist-${route.params.id}`,
  async () => {
    try {
      return await useApi(`/api/v1/playlist/${route.params.id}`, {
        method: "GET",
      });
    } catch (error) {
      console.error("Error fetching playlist: ", error);
      toast.add({
        severity: "error",
        summary: "Error fetching playlist",
        detail: error.response._data.message,
        life: 3000,
      });
      navigateTo(`/playlists`);
    }
  }
);

useHead({
  title: `${playlist.value.name} - Playlist`,
});

const editorOrAdmin = ref(false);
const editPlaylistDialog = ref(false);
const deletePlaylistDialog = ref(false);

onMounted(() => {
  if (authStore.isAuthenticated) {
    if (authStore.user.role == "editor" || authStore.user.role == "admin") {
      editorOrAdmin.value = true;
    }
  }
});

const items = ref([
  {
    label: "Edit",
    icon: "pi pi-pencil",
    command: () => {
      editPlaylistDialog.value = true;
    },
  },
  {
    label: "Delete",
    icon: "pi pi-trash",
    command: () => {
      deletePlaylistDialog.value = true;
    },
  },
]);

const hideDialog = () => {
  editPlaylistDialog.value = false;
};

const editPlaylist = async () => {
  if (playlist.value.name) {
    try {
      await useApi(`/api/v1/playlist/${playlist.value.id}`, {
        method: "PUT",
        body: {
          name: playlist.value.name,
          description: playlist.value.description,
        },
        credentials: "include",
      });
      toast.add({
        severity: "success",
        summary: "Playlist Updated",
        detail: "Playlist updated",
        life: 3000,
      });
      refresh();
      hideDialog();
    } catch (error) {
      console.error("Error editiing playlist");
      console.error(error);
      toast.add({
        severity: "error",
        summary: "Error Editing Playlist",
        detail: error.response._data.message,
        life: 3000,
      });
    }
  }
};

const deletePlaylist = async () => {
  try {
    await useApi(`/api/v1/playlist/${playlist.value.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    toast.add({
      severity: "success",
      summary: "Playlist Deleted",
      detail: "Playlist deleted",
      life: 3000,
    });
    navigateTo(`/playlists`);
  } catch (error) {
    console.error("Error deleting playlist");
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Error Deleting Playlist",
      detail: error.response._data.message,
      life: 3000,
    });
  }
};
</script>

<style lang="scss" scoped>
::v-deep(.speeddial-linear) {
  .p-speeddial-direction-left {
    right: 0;
    margin-right: 2rem;
  }
}
</style>
