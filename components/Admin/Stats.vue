<template>
  <div class="surface-ground px-4 py-5 md:px-6 lg:px-8">
    <div class="grid w-justify-center w-items-center">
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">VODs</span>
              <div class="text-900 font-medium text-xl">
                {{ stats.vod_count.toLocaleString() }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round"
              style="width: 2.5rem; height: 2.5rem"
            >
              <i class="pi pi-video text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Channels</span>
              <div class="text-900 font-medium text-xl">
                {{ stats.channel_count.toLocaleString() }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-orange-100 border-round"
              style="width: 2.5rem; height: 2.5rem"
            >
              <i class="pi pi-user text-orange-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApi } from "~/composables/useApi";

const { data: stats } = await useAsyncData(`admin-stats`, () =>
  useApi(`/api/v1/admin/stats`, {
    method: "GET",
    credentials: "include",
  })
);
</script>

<style lang="scss" scoped></style>
