<template>
  <div
    class="w-bg-white dark:w-bg-ganymede-800 dark:w-text-light-400 w-rounded w-shadow-lg w-w-10/12 md:w-w-2/3"
  >
    <!-- modal header -->
    <div
      class="w-border-b w-px-4 w-py-2 w-flex w-justify-between w-items-center"
    >
      <h3 class="w-text-lg">
        <span class="w-font-semibold">Log File:</span>
        {{ props.queue.edges.vod.ext_id }}_{{ props.queue.edges.vod.id }}-{{
          props.type
        }}.log
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
    <!-- modal body -->
    <div class="w-p-3 w-h-96 log-window w-bg-black w-text-gray-200">
      <span class="log-response" v-html="logResponse.value"> </span>
      <div id="bottomLogResponse"></div>
    </div>
    <div class="w-flex w-justify-end w-items-center w-100 w-border-t w-p-3">
      <span class="w-mr-2">Refreshes every second.</span>
      <button
        @click="closeModal()"
        class="w-bg-red-600 hover:w-bg-red-700 w-px-3 w-py-1 w-rounded w-text-white w-mr-1 close-modal"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useApi } from "~/composables/useApi";
const config = useRuntimeConfig().public;
const { $bus } = useNuxtApp();

const toast = useToast();

const logResponse = ref();
const timer = ref();

const props = defineProps({
  queue: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const { data: logResp, refresh } = await useAsyncData(
  `queue-${props.queue.id}-log-${props.type}`,
  () =>
    useApi(`/api/v1/queue/${props.queue.id}/log`, {
      method: "GET",
      params: {
        type: props.type,
      },
      credentials: "include",
    })
);

const scrollToElement = () => {
  const element = document.getElementById("bottomLogResponse");
  element.scrollIntoView({ behavior: "smooth" });
};

logResponse.value = logResp;

onMounted(async () => {
  timer.value = window.setInterval(() => {
    refresh();
    scrollToElement();
  }, 1000);
});

const fetchLog = async () => {
  try {
    const data = await $fetch(
      `${config.apiURL}/api/v1/queue/${props.queue.id}/log?type=${props.type}`
    );
    logResponse.value = data;
    scrollToElement();
  } catch (error) {
    console.error("Error fetching log:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error fetching log file, please check console for more info.",
      life: 3000,
    });
  }
};

const closeModal = () => {
  clearInterval(timer.value);
  $bus.$emit("close-log-modal");
};

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss" scoped>
.log-response {
  white-space: pre-line;
}
.log-window {
  overflow-y: scroll;
}
</style>
