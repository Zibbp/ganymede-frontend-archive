<template>
  <div class="archive-section">
    <ArchiveVodCard v-if="showPreviewVodCard" :vod="previewVodData" />
    <form @submit.prevent="archiveVod()">
      <div>
        <InputText
          @change="fetchVodInfo()"
          class="archive-vod-input"
          :class="vodNotFound ? 'p-invalid' : ''"
          v-model="vodId"
          placeholder="Vod Id"
          required
        />
      </div>
      <div class="w-flex w-mt-1">
        <Dropdown
          v-model="quality"
          :options="qualityOptions"
          optionLabel="name"
          optionValue="quality"
          placeholder="Select a Quality"
          required
        />
        <div class="field-checkbox w-ml-1 w-pt-3">
          <Checkbox id="binary" v-model="chat" :binary="true" />
          <label for="binary">Chat</label>
        </div>
      </div>
      <Button
        class="archive-vod-button"
        type="submit"
        label="Archive"
        :loading="loading"
      />
    </form>
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
const { $axios } = useNuxtApp();
const config = useRuntimeConfig().public;

const toast = useToast();

const vodId = ref();
const chat = ref(true);
const quality = ref("source");

const loading = ref(false);

const showPreviewVodCard = ref(false);
const previewVodData = ref();

const vodNotFound = ref(false);

const qualityOptions = ref([
  { name: "Source", quality: "source" },
  { name: "720p60", quality: "720p60" },
  { name: "480p30", quality: "480p30" },
  { name: "360p30", quality: "360p30" },
  { name: "160p30", quality: "160p30" },
]);

const archiveVod = async () => {
  loading.value = true;

  try {
    const archiveVodReq = await $axios.post(
      `${config.apiURL}/api/v1/archive/vod`,
      {
        vod_id: vodId.value,
        quality: quality.value,
        chat: chat.value,
      },
      { withCredentials: true }
    );
    loading.value = false;
    console.log(archiveVodReq);
  } catch (error) {
    loading.value = false;
    console.error("Error archiving vod:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error archiving vod, please check console for more info.",
      life: 3000,
    });
  }
};
const fetchVodInfo = async () => {
  showPreviewVodCard.value = false;
  vodNotFound.value = false;
  try {
    if (vodId.value.length > 0) {
      const data = await $fetch(
        `${config.apiURL}/api/v1/twitch/vod?id=${vodId.value}`
      );
      previewVodData.value = data;
      showPreviewVodCard.value = true;
    }
  } catch (error) {
    showPreviewVodCard.value = false;
    if (error.response.status == 404) {
      vodNotFound.value = true;
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Unable to find VOD",
        life: 3000,
      });
    } else {
      console.error("Failed to fetch VOD info:", error);
      vodNotFound.value = true;
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error fetching VOD info, please check console for more info.",
        life: 3000,
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep(.archive-vod-input.p-inputtext) {
  width: 100%;
}
::v-deep(.archive-vod-button.p-button) {
  margin-top: 0.25rem;
  width: 100%;
}
.archive-section {
  width: 15rem;
  max-width: 15rem;
}
</style>
