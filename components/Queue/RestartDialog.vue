<template>
  <div
    class="w-bg-white dark:w-bg-ganymede-800 dark:w-text-light-400 w-rounded w-shadow-lg w-w-1/3"
  >
    <!-- modal header -->
    <div
      class="w-border-b w-px-4 w-py-2 w-flex w-justify-between w-items-center"
    >
      <h3 class="w-text-lg">
        <span
          >Restart Task:
          <span class="w-font-semibold">{{ props.task }}</span></span
        >
      </h3>
      <button @click="closeModal()" class="w-text-black close-modal">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="w-flex w-justify-end w-items-center w-100 w-border-t w-p-3">
      <div class="field-checkbox w-mr-1 w-pt-3">
        <Checkbox id="binary" v-model="continueBool" :binary="true" />
        <label for="binary">Continue with subsequent steps?</label>
      </div>

      <Button
        @click="closeModal()"
        label="Close"
        class="p-button-danger p-button-text"
      />

      <Button
        label="Restart"
        class="p-button-help w-ml-1"
        icon="pi pi-refresh"
        :loading="loading"
        @click="restartTask"
      />
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import { useApi } from "~/composables/useApi";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const { $bus } = useNuxtApp();

const props = defineProps({
  queue: {
    type: Object,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
});

const continueBool = ref(false);
const loading = ref(false);

const restartTask = async () => {
  loading.value = true;
  try {
    await useApi(`/api/v1/archive/restart`, {
      method: "POST",
      body: {
        queue_id: props.queue.id,
        task: props.task,
      },
      credentials: "include",
    });
    loading.value = false;
    toast.add({
      severity: "success",
      summary: "Task restarted",
      life: 3000,
    });
    $bus.$emit("close-restart-dialog");
  } catch (error) {
    loading.value = false;
    console.error("[Task Restart] Error: ", error);
    toast.add({
      severity: "error",
      summary: "Error restarting task",
      detail: error.data.message,
      life: 3000,
    });
  }
};

const closeModal = () => {
  $bus.$emit("close-restart-dialog");
};
</script>

<style lang="scss" scoped></style>
