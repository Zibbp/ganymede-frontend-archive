<template>
  <div>
    <div
      v-if="showLogModal"
      class="modal w-h-screen w-w-full w-fixed w-z-10 w-left-0 w-top-0 w-flex w-justify-center w-items-center w-bg-black w-bg-opacity-50"
    >
      <QueueLogModal v-if="showLogModal" :queue="queue" :type="type" />
    </div>
    <div
      v-if="showRestartDialog"
      class="modal w-h-screen w-w-full w-fixed w-z-10 w-left-0 w-top-0 w-flex w-justify-center w-items-center w-bg-black w-bg-opacity-50"
    >
      <QueueRestartDialog :task="task" :queue="queue" />
    </div>
    <QueueHeader :queue="queue" />
    <div class="w-container w-mx-auto w-mt-6">
      <div><QueueVodTimeline :key="vodTimelineReload" :queue="queue" /></div>
      <div class="w-grid w-grid-cols-12 w-mt-4">
        <div
          class="w-col-span-12 sm:w-col-span-12 md:w-col-span-12 lg:w-col-span-6 xl:w-col-span-6 2xl:w-col-span-6 w-full"
        >
          <QueueVideoTimeline :key="vodTimelineReload" :queue="queue" />
        </div>

        <div
          class="w-col-span-12 sm:w-col-span-12 md:w-col-span-12 lg:w-col-span-6 xl:w-col-span-6 2xl:w-col-span-6 w-full"
        >
          <QueueChatTimeline :key="vodTimelineReload" :queue="queue" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInterval } from "@vueuse/core";
import { useApi } from "~/composables/useApi";
import { useToast } from "primevue/usetoast";
import { useAuthGuard, useRoleGuard } from "~/composables/useGuard";
const route = useRoute();
const config = useRuntimeConfig().public;
const { $bus } = useNuxtApp();
const toast = useToast();

onMounted(() => {
  useAuthGuard();
  useRoleGuard("archiver");
});

const timer = ref();

// const { data: queue, refresh } = await useFetch(
//   () => `${config.apiURL}/api/v1/queue/${route.params.id}`
// );

const { data: queue, refresh } = await useAsyncData(
  `queue-${route.params.id}`,
  () =>
    useApi(`/api/v1/queue/${route.params.id}`, {
      method: "GET",
      credentials: "include",
    })
);

const intervalId = ref();
const vodTimelineReload = ref(0);
const showLogModal = ref(false);
const type = ref();

const showRestartDialog = ref(false);
const task = ref();

// const refresh = () => refreshNuxtData(`queue-${route.params.id}`);

onMounted(async () => {
  timer.value = window.setInterval(async () => {
    // refreshNuxtData(`queue-${route.params.id}`);
    refresh();
    // Nuxt3 data fetching reload is having issues updating data in the page once fetched.
    // This is a temporary workaround to recreate the components with new data.
    vodTimelineReload.value++;
  }, 1000);
});

$bus.$on("close-log-modal", () => {
  showLogModal.value = false;
});

$bus.$on("show-log-modal", (logType) => {
  type.value = logType.logType;
  showLogModal.value = true;
});

$bus.$on("show-restart-dialog", (restartTask) => {
  task.value = restartTask.task;
  showRestartDialog.value = true;
});

$bus.$on("close-restart-dialog", () => {
  showRestartDialog.value = false;
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss" scoped></style>
