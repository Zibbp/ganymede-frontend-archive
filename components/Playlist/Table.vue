<template>
  <div>
    <DataTable
      :value="props.playlists"
      :rowHover="true"
      class="w-cursor-pointer"
      v-model:selection="selectedPlaylist"
      selectionMode="single"
      dataKey="id"
      @rowSelect="onRowSelect"
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      responsiveLayout="scroll"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
    >
      <Column field="name" header="Name" style="min-width: 24rem"></Column>
      <Column field="description" header="Description"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import Row from "primevue/row"; //optional for row

const props = defineProps({
  playlists: {
    type: Array,
    required: true,
  },
});

const selectedPlaylist = ref();

const onRowSelect = (event) => {
  navigateTo(`/playlists/${event.data.id}`);
};
</script>

<style lang="scss" scoped></style>
