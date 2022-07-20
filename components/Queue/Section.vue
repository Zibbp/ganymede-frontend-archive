<template>
  <div>
    <Button
      @click="refreshQueue"
      icon="pi pi-refresh"
      class="p-button-rounded p-button-secondary p-button-text"
    />
    <DataTable :value="queueItems" responsiveLayout="scroll">
      <Column field="id" header="ID"></Column>
      <Column field="edges.vod.ext_id" header="Ext ID"></Column>
      <Column header="On Hold">
        <template #body="slotProps">
          <i
            v-if="slotProps.data.on_hold"
            class="pi pi-check w-text-green-600"
          ></i>
          <i v-else class="pi pi-times w-text-red-600"></i>
        </template>
      </Column>
      <Column header="Live Archive">
        <template #body="slotProps">
          <i
            v-if="slotProps.data.live_archive"
            class="pi pi-check w-text-green-600"
          ></i>
          <i v-else class="pi pi-times w-text-red-600"></i>
        </template>
      </Column>
      <Column header="Processing">
        <template #body="slotProps">
          <i
            v-if="slotProps.data.processing"
            class="pi pi-check w-text-green-600"
          ></i>
          <i v-else class="pi pi-times w-text-red-600"></i>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="slotProps">
          <Button
            @click="navigateTo({ path: `/queue/${slotProps.data.id}` })"
            icon="pi pi-chevron-right"
            class="p-button-rounded p-button-secondary p-button-text"
        /></template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useApi } from "~/composables/useApi";
const router = useRouter();
const config = useRuntimeConfig().public;

const { data: queueItems, refresh } = await useAsyncData(`queue-items`, () =>
  useApi("/api/v1/queue", {
    method: "GET",
    params: {
      processing: true,
    },
    credentials: "include",
  })
);

const refreshQueue = () => {
  refresh();
};
</script>

<style lang="scss" scoped></style>
