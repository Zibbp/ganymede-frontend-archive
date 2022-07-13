<template>
  <div class="w-flex w-items-center w-justify-center">
    <div v-if="pending">Loading...</div>
    <div
      v-else
      class="w-w-1/3 w-mt-4 w-bg-lara-200 w-p-4 w-rounded-lg dark:w-bg-lara-800 dark:w-text-light-400"
    >
      <form @submit.prevent="updateConfig()">
        <div class="w-text-3xl w-text-center">Application Settings</div>
        <div class="w-mt-1 w-mb-3">
          Before editing values,
          <a
            href="https://github.com/Zibbp/ganymede/wiki/Application-Settings"
            target="_blank"
            class="w-text-blue-500"
            >read the documentation page</a
          >
          for proper syntax and configuration options.
        </div>
        <!-- Checkbox section -->
        <div class="w-flex">
          <div class="field-checkbox">
            <Checkbox
              id="binary"
              v-model="config.registration_enabled"
              :binary="true"
            />
            <label for="binary">Registration Enabled</label>
          </div>
        </div>
        <!-- Text fields -->
        <div>
          <div class="field">
            <label for="webhook">Webhook URL</label>
            <small id="webhook-help">Webhook for notifications.</small>
            <InputText
              v-model="config.webhook_url"
              id="webhook"
              class="full-width"
              type="text"
              aria-describedby="webhook-help"
            />
          </div>
          <div>
            <div class="field">
              <label for="ffmpeg-params">Video Convert FFmpeg Params</label>
              <small id="ffmpeg-params-help"
                >Post video download ffmpeg options.</small
              >
            </div>
            <div>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon"> ffmpeg -i {input} </span>
                <InputText
                  v-model="config.parameters.video_convert"
                  id="ffmpeg-params"
                  type="text"
                  required
                />
                <span class="p-inputgroup-addon"> {output} </span>
              </div>
            </div>
          </div>
          <div class="w-mt-3">
            <div class="field">
              <label for="chat-render">Chat Render Params</label>
              <small id="chat-render-help">Chat render options.</small>
            </div>
            <div>
              <div class="p-inputgroup">
                <InputText
                  v-model="config.parameters.chat_render"
                  id="chat-render"
                  type="text"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div class="w-mt-4">
          <Button label="Save" type="submit" class="p-button-help w-w-full" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useApi } from "~/composables/useApi";
import { useToast } from "primevue/usetoast";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const toast = useToast();

const {
  pending,
  data: config,
  refresh,
} = useLazyAsyncData("admin-settings", () =>
  useApi(`/api/v1/config`, {
    method: "GET",
    credentials: "include",
  }).catch((error) => {
    console.error("Error fetching config: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error fetching config",
      life: 3000,
    });
  })
);

const updateConfig = async () => {
  try {
    await useApi(`/api/v1/config`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(config.value),
    });
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Config updated",
      life: 3000,
    });
  } catch (error) {
    console.error("Error updating config: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error updating config",
      life: 3000,
    });
  }
};
</script>

<style lang="scss" scoped>
.field * {
  display: block;
}
.full-width {
  width: 100%;
}
</style>
