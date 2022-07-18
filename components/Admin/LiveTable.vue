<template>
  <div>
    <!-- <div v-if="pending">Loading...</div> -->
    <div>
      <div>
        <div class="card">
          <Toolbar>
            <template #start>
              <Button
                @click="refreshlives"
                icon="pi pi-refresh"
                class="p-button-rounded p-button-secondary p-button-text"
              />
            </template>

            <template #end>
              <Button
                label="Add Watched Channel"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew" />
              <Button
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteSelected"
                :disabled="!selectedlives || !selectedlives.length"
            /></template>
          </Toolbar>

          <DataTable
            ref="dt"
            :value="lives"
            v-model:selection="selectedlives"
            dataKey="id"
            :loading="loading"
            :paginator="true"
            :rows="15"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[15, 25, 50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} lives"
            responsiveLayout="scroll"
            :rowHover="rowHover"
          >
            <template #header>
              <div
                class="table-header flex flex-column md:flex-row md:justiify-content-between"
              >
                <h5 class="mb-2 md:m-0 p-as-md-center">
                  Manage Live Watched Channels
                </h5>
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Search..."
                  />
                </span>
              </div>
            </template>

            <Column
              selectionMode="multiple"
              style="width: 3rem"
              :exportable="false"
            ></Column>
            <Column field="id" header="ID" :sortable="true" style="width: 2rem">
              <template #body="slotProps">
                <span :title="slotProps.data.id" class="w-line-clamp-1">{{
                  slotProps.data.id
                }}</span>
              </template>
            </Column>

            <Column field="display_name" header="Name" :sortable="true">
              <template #body="slotProps">
                <span>{{ slotProps.data.edges.channel.display_name }}</span>
              </template>
            </Column>

            <Column field="last_live" header="Last Live" :sortable="true">
              <template #body="slotProps">
                <span>{{
                  dayjs(slotProps.data.last_live).format("YYYY/MM/DD h:mm A")
                }}</span>
              </template>
            </Column>
            <Column :exportable="false">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editlive(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-warning"
                  @click="confirmDeletelive(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <Dialog
          v-model:visible="liveDialog"
          :style="{ width: '450px' }"
          header="Live Watched Channel"
          :modal="true"
          class="p-fluid"
        >
          <div v-if="!live.edit" class="field">
            <label for="channel">Channel</label>
            <Dropdown
              id="channel"
              v-model="live.channel_id"
              :options="channels"
              optionLabel="display_name"
              placeholder="Select a Channel"
              :filter="true"
              required="true"
              :class="{ 'p-invalid': submitted && !live.channel_id }"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.display_name">
                  <span>{{ slotProps.value.display_name }}</span>
                </div>
              </template>
            </Dropdown>

            <small class="p-error" v-if="submitted && !live.channel_id"
              >Channel is required.</small
            >
          </div>

          <div class="field">
            <div class="field-checkbox w-mt-4">
              <Checkbox
                id="archive_chat"
                v-model="live.archive_chat"
                :binary="true"
              />
              <label for="archive_chat">Archive Chat</label>
            </div>
          </div>

          <div class="field">
            <label for="resolution">Resolution</label>
            <Dropdown
              id="resolution"
              v-model="live.resolution"
              :options="qualityOptions"
              optionLabel="name"
              optionValue="quality"
              placeholder="Select a Resolution"
              required="true"
              :class="{ 'p-invalid': submitted && !live.resolution }"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.resolution">
                  <span>{{ slotProps.value.resolution }}</span>
                </div>
              </template>
            </Dropdown>
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
              @click="createlive"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteliveDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <div v-if="live">
              Are you sure you want to delete live watched channel
              <b>{{ live.edges.channel.display_name }}</b
              >?
            </div>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteliveDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deletelive"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deletelivesDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <div>
              <span v-if="live"
                >Are you sure you want to delete the selected live watched
                channels?</span
              >
            </div>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deletelivesDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedlives"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import Row from "primevue/row"; //optional for row
import Toolbar from "primevue/toolbar";
import FileUpload from "primevue/fileupload";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import RadioButton from "primevue/radiobutton";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";

import { useApi } from "~/composables/useApi";
import dayjs from "dayjs/esm";
const config = useRuntimeConfig().public;
const toast = useToast();

const {
  pending,
  data: lives,
  refresh,
} = useLazyAsyncData("admin-lives", () =>
  useApi(`/api/v1/live`, {
    method: "GET",
    credentials: "include",
  }).catch((error) => {
    console.error("Error fetching live watched channels: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error fetching live watched channels",
      life: 3000,
    });
  })
);

const dt = ref();
const rowHover = ref(true);
const liveDialog = ref(false);
const deleteliveDialog = ref(false);
const deletelivesDialog = ref(false);
const live = ref({});
const selectedlives = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const loading = ref(false);

const qualityOptions = ref([
  { name: "Best", quality: "best" },
  { name: "720p60", quality: "720p60" },
  { name: "480p30", quality: "480p30" },
  { name: "360p30", quality: "360p30" },
  { name: "160p30", quality: "160p30" },
]);

const channels = ref({});

onMounted(() => {
  // Fetch channels for live watched channels creation
  useApi(`/api/v1/channel`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => (channels.value = res))
    .catch((err) => {
      console.error("Error fetching channels", err);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error fetching channels",
        life: 3000,
      });
    });
});

const refreshlives = () => {
  loading.value = true;
  refresh();
  loading.value = false;
};

const openNew = () => {
  live.value = {};
  live.value.new = true;
  live.value.archive_chat = true;
  submitted.value = false;
  liveDialog.value = true;
};

const hideDialog = () => {
  liveDialog.value = false;
  submitted.value = false;
};
const createlive = async () => {
  submitted.value = true;

  try {
    if (live.value.new) {
      if (live.value.channel_id && live.value.resolution) {
        // Creating live
        await useApi(`/api/v1/live`, {
          method: "POST",
          credentials: "include",
          body: {
            channel_id: live.value.channel_id.id,
            resolution: live.value.resolution,
            archive_chat: live.value.archive_chat,
          },
        });

        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Created live watched channel",
          life: 3000,
        });
        liveDialog.value = false;
        live.value = {};
        refreshlives();
      }
    } else {
      await useApi(`/api/v1/live/${live.value.id}`, {
        method: "PUT",
        credentials: "include",
        body: {
          resolution: live.value.resolution,
          archive_chat: live.value.archive_chat,
        },
      });
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Updated live watched channel",
        life: 3000,
      });
      liveDialog.value = false;
      live.value = {};
      refreshlives();
    }
  } catch (error) {
    console.error("Error creating live: ", error);
    console.log(error.response);
    toast.add({
      severity: "error",
      summary: "Error Creating Live Watch Channel",
      detail: error.response._data.message,
      life: 3000,
    });
  }
};

const editlive = (prod) => {
  live.value = { ...prod };
  live.value.edit = true;
  liveDialog.value = true;
};
const confirmDeletelive = (prod) => {
  live.value = prod;
  deleteliveDialog.value = true;
};
const deletelive = async () => {
  try {
    await useApi(`/api/v1/live/${live.value.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    deleteliveDialog.value = false;
    live.value = {};

    refreshlives();

    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "Live Watched Channel Deleted",
      life: 3000,
    });
  } catch (error) {
    console.error("Error deleting live: " + error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error deleting live watched channel",
      life: 3000,
    });
  }
};

const confirmDeleteSelected = () => {
  deletelivesDialog.value = true;
};
const deleteSelectedlives = async () => {
  for (const live of selectedlives.value) {
    try {
      await useApi(`/api/v1/live/${live.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error(`Error deleting live ${live.name}: `, error);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: `Error deleting live: ${live.name}`,
        life: 3000,
      });
    }
  }

  deletelivesDialog.value = false;
  selectedlives.value = null;
  refreshlives();
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "lives Deleted",
    life: 3000,
  });
};
</script>

<style lang="scss" scoped>
.vod-type-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
}
.type-archive {
  background-color: #b3e5fc;
  color: #23547b;
}
.type-live {
  background-color: #eccfff;
  color: #694382;
}
.type-highlight {
  background-color: #c8e6c9;
  color: #256029;
}
.type-upload {
  background-color: #ffd8b2;
  color: #805b36;
}
.type-clip {
  background-color: #ffcdd2;
  color: #c63737;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 960px) {
    align-items: start;
  }
}

.product-image {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.confirmation-content {
  align-items: center;
  justify-content: center;
}

::v-deep(.p-toolbar) {
  background: none !important;
  border: 0 !important;
}

@media screen and (max-width: 960px) {
  ::v-deep(.p-toolbar) {
    flex-wrap: wrap;

    .p-button {
      margin-bottom: 0.25rem;
    }
  }
}
.image-text {
  vertical-align: middle;
  margin-left: 0.5rem;
}
</style>
