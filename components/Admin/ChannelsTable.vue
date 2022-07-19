<template>
  <div>
    <!-- <div v-if="pending">Loading...</div> -->
    <div>
      <div>
        <div class="card">
          <Toolbar>
            <template #start>
              <Button
                @click="refreshChannels"
                icon="pi pi-refresh"
                class="p-button-rounded p-button-secondary p-button-text"
              />
            </template>

            <template #end>
              <Button
                label="New Manual Channel"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew" />
              <Button
                label="Add Twitch Channel"
                icon="pi pi-plus"
                class="p-button-help mr-2"
                @click="addNewTwitch" />
              <Button
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteSelected"
                :disabled="!selectedChannels || !selectedChannels.length"
            /></template>
          </Toolbar>

          <DataTable
            ref="dt"
            :value="channels"
            v-model:selection="selectedChannels"
            dataKey="id"
            :loading="loading"
            :paginator="true"
            :rows="15"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[15, 25, 50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} channels"
            responsiveLayout="scroll"
            :rowHover="rowHover"
          >
            <template #header>
              <div
                class="table-header flex flex-column md:flex-row md:justiify-content-between"
              >
                <h5 class="mb-2 md:m-0 p-as-md-center">Manage Channels</h5>
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
                <span>{{ slotProps.data.display_name }}</span>
              </template>
            </Column>

            <Column field="created_at" header="Created At" :sortable="true">
              <template #body="slotProps">
                <span>{{
                  dayjs(slotProps.data.created_at).format("YYYY/MM/DD")
                }}</span>
              </template>
            </Column>
            <Column :exportable="false">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editChannel(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-warning"
                  @click="confirmDeleteChannel(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <Dialog
          v-model:visible="channelDialog"
          :style="{ width: '450px' }"
          header="Channel"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
              id="name"
              v-model.trim="channel.name"
              required="true"
              :class="{ 'p-invalid': submitted && !channel.name }"
            />
            <small class="p-error" v-if="submitted && !channel.name"
              >Name is required.</small
            >
          </div>

          <div class="field">
            <label for="display_name">Display Name</label>
            <InputText
              id="display_name"
              v-model.trim="channel.display_name"
              required="true"
              :class="{ 'p-invalid': submitted && !channel.display_name }"
            />
            <small class="p-error" v-if="submitted && !channel.display_name"
              >Display Name is required.</small
            >
          </div>

          <div class="field">
            <label for="image_path">Image Path</label>
            <InputText
              id="image_path"
              v-model.trim="channel.image_path"
              required="true"
              :class="{ 'p-invalid': submitted && !channel.image_path }"
            />
            <small class="p-error" v-if="submitted && !channel.image_path"
              >Image Path is required.</small
            >
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
              @click="createChannel"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="newTwitchDialog"
          :style="{ width: '450px' }"
          header="Twitch Channel"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
              id="name"
              v-model.trim="newTwitchChannel.name"
              required="true"
              :class="{ 'p-invalid': submitted && !newTwitchChannel.name }"
            />
            <small class="p-error" v-if="submitted && !newTwitchChannel.name"
              >Name is required.</small
            >
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
              @click="createTwitchChannel"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteChannelDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <div v-if="channel">
              Are you sure you want to delete <b>{{ channel.display_name }}</b
              >'s channel?
            </div>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteChannelDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteChannel"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteChannelsDialog"
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
              <span v-if="channel"
                >Are you sure you want to delete the selected Channels?</span
              >
            </div>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteChannelsDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedChannels"
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
  data: channels,
  refresh,
} = useLazyAsyncData("admin-channels", () =>
  useApi(`/api/v1/channel`, {
    method: "GET",
    credentials: "include",
  }).catch((error) => {
    console.error("Error fetching channels: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error fetching channels",
      life: 3000,
    });
  })
);

const dt = ref();
const rowHover = ref(true);
const channelDialog = ref(false);
const deleteChannelDialog = ref(false);
const deleteChannelsDialog = ref(false);
const channel = ref({});
const selectedChannels = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const loading = ref(false);

const newTwitchDialog = ref(false);
const newTwitchChannel = ref({});

const refreshChannels = () => {
  loading.value = true;
  refresh();
  loading.value = false;
};

watch(
  () => [channel.value.name],
  (cV, oV) => {
    if (channel.value.new) {
      channel.value.image_path = `/vods/${channel.value.name}/profile.png`;
    }
  }
);

const openNew = () => {
  channel.value = {};
  channel.value.new = true;
  submitted.value = false;
  channelDialog.value = true;
};
const addNewTwitch = () => {
  newTwitchChannel.value = {};
  submitted.value = false;
  newTwitchDialog.value = true;
};
const hideDialog = () => {
  channelDialog.value = false;
  submitted.value = false;
};
const createChannel = async () => {
  submitted.value = true;

  if (
    channel.value.name &&
    channel.value.display_name &&
    channel.value.image_path
  ) {
    try {
      if (channel.value.edit == true) {
        // Editing Channel
        await useApi(`/api/v1/channel/${channel.value.id}`, {
          method: "PUT",
          credentials: "include",
          body: {
            name: channel.value.name,
            display_name: channel.value.display_name,
            image_path: channel.value.image_path,
          },
        });

        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Channel Edited",
          life: 3000,
        });
      } else {
        // Creating Channel
        await useApi(`/api/v1/channel`, {
          method: "POST",
          credentials: "include",
          body: {
            name: channel.value.name,
            display_name: channel.value.display_name,
            image_path: channel.value.image_path,
          },
        });

        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Channel Created",
          life: 3000,
        });
      }
      channelDialog.value = false;
      channel.value = {};
      refreshChannels();
    } catch (error) {
      console.error("Error creating Channel: ", error);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error creating Channel",
        life: 3000,
      });
    }
  }
};

const createTwitchChannel = async () => {
  submitted.value = true;
  try {
    if (newTwitchChannel.value.name) {
      await useApi(`/api/v1/archive/channel`, {
        method: "POST",
        credentials: "include",
        body: {
          channel_name: newTwitchChannel.value.name,
        },
      });

      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Twitch Channel Created",
        life: 3000,
      });
      newTwitchDialog.value = false;
      newTwitchChannel.value = {};
      refreshChannels();
    }
  } catch (error) {
    console.error("Error creating Twitch Channel: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response._data.message,
      life: 3000,
    });
  }
};

const editChannel = (prod) => {
  channel.value = { ...prod };
  channel.value.edit = true;
  channelDialog.value = true;
};
const confirmDeleteChannel = (prod) => {
  channel.value = prod;
  deleteChannelDialog.value = true;
};
const deleteChannel = async () => {
  try {
    await useApi(`/api/v1/channel/${channel.value.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    deleteChannelDialog.value = false;
    channel.value = {};

    refreshChannels();

    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "Channel Deleted",
      life: 3000,
    });
  } catch (error) {
    console.error("Error deleting channel: " + error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error deleting Channel",
      life: 3000,
    });
  }
};

const confirmDeleteSelected = () => {
  deleteChannelsDialog.value = true;
};
const deleteSelectedChannels = async () => {
  for (const channel of selectedChannels.value) {
    try {
      await useApi(`/api/v1/channel/${channel.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error(`Error deleting channel ${channel.name}: `, error);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: `Error deleting channel: ${channel.name}`,
        life: 3000,
      });
    }
  }

  deleteChannelsDialog.value = false;
  selectedChannels.value = null;
  refreshChannels();
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Channels Deleted",
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
