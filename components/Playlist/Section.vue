<template>
  <div>
    <div v-if="editorOrAdmin" class="w-flow-root w-mt-2">
      <div class="w-float-right">
        <Button
          @click="addPlaylistDialog = true"
          icon="pi pi-plus"
          class="p-button-rounded p-button-success"
        />
      </div>
    </div>
    <PlaylistTable class="w-mt-4" :playlists="playlists" />
    <Dialog
      v-model:visible="addPlaylistDialog"
      :style="{ width: '450px' }"
      header="Create Playlist"
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
          @click="createPlaylist"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";
import { useApi } from "~/composables/useApi";
import { useAuthStore } from "~/stores/AuthStore";

const authStore = useAuthStore();
const toast = useToast();

const { data: playlists, refresh } = await useAsyncData(`playlists`, () =>
  useApi(`/api/v1/playlist`, {
    method: "GET",
  })
);

const editorOrAdmin = ref(false);
const addPlaylistDialog = ref(false);
const playlist = ref({});

onMounted(() => {
  if (authStore.isAuthenticated) {
    if (authStore.user.role == "editor" || authStore.user.role == "admin") {
      editorOrAdmin.value = true;
    }
  }
});

const hideDialog = () => {
  addPlaylistDialog.value = false;
};

const createPlaylist = async () => {
  if (playlist.value.name) {
    try {
      await useApi(`/api/v1/playlist`, {
        method: "POST",
        body: {
          name: playlist.value.name,
          description: playlist.value.description,
        },
        credentials: "include",
      });
      refresh();
      hideDialog();
      playlist.value = {};
    } catch (error) {
      console.error("Error creating playlist");
      console.error(error);
      toast.add({
        severity: "error",
        summary: "Error Creating Playlist",
        detail: error.response._data.message,
        life: 3000,
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
