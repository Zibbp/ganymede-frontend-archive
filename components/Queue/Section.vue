<template>
  <div>
    <DataTable :value="queueItems" responsiveLayout="scroll">
      <Column field="id" header="ID"></Column>
      <Column header="On Hold">
        <template #body="slotProps">{{
          slotProps.data.on_hold ? "true" : "false"
        }}</template>
      </Column>
      <Column header="Live Archive">
        <template #body="slotProps">{{
          slotProps.data.live_archive ? "true" : "false"
        }}</template>
      </Column>
      <Column header="Processing">
        <template #body="slotProps">{{ slotProps.data.processing }}</template>
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

const { data: queueItems } = await useAsyncData(`queue-items`, () =>
  useApi("/api/v1/queue", {
    method: "GET",
    params: {
      processing: true,
    },
    credentials: "include",
  })
);
</script>

<style lang="scss" scoped></style>
