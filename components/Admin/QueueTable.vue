<template>
  <div>
    <!-- <div v-if="pending">Loading...</div> -->
    <div>
      <div>
        <div class="card">
          <Toolbar>
            <template #start>
              <Button
                @click="refreshqueues"
                icon="pi pi-refresh"
                class="p-button-rounded p-button-secondary p-button-text"
              />
            </template>

            <template #end>
              <Button
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteSelected"
                :disabled="!selectedqueues || !selectedqueues.length"
            /></template>
          </Toolbar>

          <DataTable
            ref="dt"
            :value="queues"
            v-model:selection="selectedqueues"
            dataKey="id"
            :loading="loading"
            :paginator="true"
            :rows="15"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[15, 25, 50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} queues"
            responsiveLayout="scroll"
            :rowHover="rowHover"
          >
            <template #header>
              <div
                class="table-header flex flex-column md:flex-row md:justiify-content-between"
              >
                <h5 class="mb-2 md:m-0 p-as-md-center">Manage Queue Items</h5>
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

            <Column
              field="edges.vod.id"
              header="VOD ID"
              :sortable="true"
              style="width: 2rem"
            >
              <template #body="slotProps">
                <span
                  :title="slotProps.data.edges.vod.id"
                  class="w-line-clamp-1"
                  >{{ slotProps.data.edges.vod.id }}</span
                >
              </template>
            </Column>

            <Column
              field="edges.vod.ext_id"
              header="Ext VOD ID"
              :sortable="true"
            >
              <template #body="slotProps">
                <span :title="slotProps.data.edges.vod.ext_id">{{
                  slotProps.data.edges.vod.ext_id
                }}</span>
              </template>
            </Column>

            <Column field="processing" header="Processing" :sortable="true">
              <template #body="slotProps">
                <span>{{ slotProps.data.processing ? "true" : "false" }}</span>
              </template>
            </Column>

            <Column field="on_hold" header="On Hold" :sortable="true">
              <template #body="slotProps">
                <span>{{ slotProps.data.on_hold ? "true" : "false" }}</span>
              </template>
            </Column>

            <Column field="live_archive" header="Live Archive" :sortable="true">
              <template #body="slotProps">
                <span>{{
                  slotProps.data.live_archive ? "true" : "false"
                }}</span>
              </template>
            </Column>

            <Column field="created_at" header="Created At" :sortable="true">
              <template #body="slotProps">
                <span>{{
                  dayjs(slotProps.data.created_at).format("YYYY/MM/DD")
                }}</span>
              </template>
            </Column>
            <Column :exportable="false" style="min-width: 8rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-external-link"
                  class="p-button-rounded p-button-help mr-2"
                  @click="navigateTo(`/queue/${slotProps.data.id}`)"
                />
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editqueue(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-warning"
                  @click="confirmDeletequeue(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <Dialog
          v-model:visible="queueDialog"
          :style="{ width: '450px' }"
          header="Queue Item"
          :modal="true"
          class="p-fluid"
        >
          <div class="field-checkbox w-mt-4">
            <Checkbox
              id="processing"
              v-model="queue.processing"
              :binary="true"
            />
            <label for="processing">Processing</label>
          </div>

          <div class="field-checkbox w-mt-4">
            <Checkbox id="on_hold" v-model="queue.on_hold" :binary="true" />
            <label for="on_hold">On Hold</label>
          </div>

          <div class="field-checkbox w-mt-4">
            <Checkbox
              id="video_processing"
              v-model="queue.video_processing"
              :binary="true"
            />
            <label for="video_processing">Video Processing</label>
          </div>

          <div class="field-checkbox w-mt-4">
            <Checkbox
              id="chat_processing"
              v-model="queue.chat_processing"
              :binary="true"
            />
            <label for="chat_processing">Chat Processing</label>
          </div>

          <div class="field-checkbox w-mt-4">
            <Checkbox
              id="live_archive"
              v-model="queue.live_archive"
              :binary="true"
            />
            <label for="live_archive">Live Archive</label>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="task_vod_create_folder">Create Folder</label>
              <Dropdown
                id="tyle"
                v-model="queue.task_vod_create_folder"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_vod_create_folder,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>

            <div class="field col">
              <label for="task_vod_download_thumbnail"
                >Download Thumbnail</label
              >
              <Dropdown
                id="tyle"
                v-model="queue.task_vod_download_thumbnail"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_vod_download_thumbnail,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="task_vod_save_info">Save Info</label>
              <Dropdown
                id="tyle"
                v-model="queue.task_vod_save_info"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_vod_save_info,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>

            <div class="field col">
              <label for="task_video_download">Video Download</label>
              <Dropdown
                id="tyle"
                v-model="queue.task_video_download"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_video_download,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="task_video_convert">Video Convert</label>
              <Dropdown
                id="tyle"
                v-model="queue.task_video_convert"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_video_convert,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>

            <div class="field col">
              <label for="task_video_move">Video Move</label>
              <Dropdown
                id="tyle"
                v-model="queue.task_video_move"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_video_move,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="task_chat_download">Chat Download</label>
              <Dropdown
                id="tyle"
                v-model="queue.task_chat_download"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_chat_download,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>

            <div class="field col">
              <label for="task_chat_download">Live Chat Convert</label>
              <Dropdown
                id="tyle"
                v-model="queue.task_chat_convert"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_chat_convert,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="task_chat_render">Chat Render</label>
              <Dropdown
                id="tyle"
                v-model="queue.task_chat_render"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_chat_render,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>

            <div class="field col">
              <label for="task_chat_move">Chat Move</label>
              <Dropdown
                id="tyle"
                v-model="queue.task_chat_move"
                :options="taskStatusStates"
                optionLabel="label"
                placeholder="Select a Status"
                required="true"
                :class="{
                  'p-invalid': submitted && !queue.task_chat_move,
                }"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span
                      :class="'task-status-badge type-' + slotProps.value.value"
                      >{{ slotProps.value.label }}</span
                    >
                  </div>
                  <div v-else-if="slotProps.value && !slotProps.value.value">
                    <span
                      :class="
                        'task-status-badge type-' +
                        slotProps.value.toLowerCase()
                      "
                      >{{ slotProps.value }}</span
                    >
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
              </Dropdown>
            </div>
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
              @click="createqueue"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deletequeueDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <div v-if="queue">
              Are you sure you want to delete queue <b>{{ queue.id }}</b
              >?
            </div>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deletequeueDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deletequeue"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deletequeuesDialog"
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
              <span v-if="queue"
                >Are you sure you want to delete the selected queue items?</span
              >
            </div>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deletequeuesDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedqueues"
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
  data: queues,
  refresh,
} = useLazyAsyncData("admin-queues", () =>
  useApi(`/api/v1/queue`, {
    method: "GET",
    credentials: "include",
  }).catch((error) => {
    console.error("Error fetching queue: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error fetching queues",
      life: 3000,
    });
  })
);

const dt = ref();
const rowHover = ref(true);
const queueDialog = ref(false);
const deletequeueDialog = ref(false);
const deletequeuesDialog = ref(false);
const queue = ref({});
const selectedqueues = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const loading = ref(false);

const taskStatusStates = ref([
  { label: "success", value: "success" },
  { label: "running", value: "running" },
  { label: "pending", value: "pending" },
  { label: "failed", value: "failed" },
]);

const refreshqueues = () => {
  loading.value = true;
  refresh();
  loading.value = false;
};

watch(
  () => [queue.value.name],
  (cV, oV) => {
    if (queue.value.new) {
      queue.value.image_path = `/vods/${queue.value.name}/profile.png`;
    }
  }
);

const hideDialog = () => {
  queueDialog.value = false;
  submitted.value = false;
};
const createqueue = async () => {
  submitted.value = true;
  try {
    // If status is changed set it
    let taskVodCreateFolder = queue.value.task_vod_create_folder;
    if (typeof taskVodCreateFolder === "object") {
      taskVodCreateFolder = queue.value.task_vod_create_folder.value;
    }
    let taskVodDownloadThumbnail = queue.value.task_vod_download_thumbnail;
    if (typeof taskVodDownloadThumbnail === "object") {
      taskVodDownloadThumbnail = queue.value.task_vod_download_thumbnail.value;
    }
    let taskVodSaveInfo = queue.value.task_vod_save_info;
    if (typeof taskVodSaveInfo === "object") {
      taskVodSaveInfo = queue.value.task_vod_save_info.value;
    }
    let taskVideoDownload = queue.value.task_video_download;
    if (typeof taskVideoDownload === "object") {
      taskVideoDownload = queue.value.task_video_download.value;
    }
    let taskVideoConvert = queue.value.task_video_convert;
    if (typeof taskVideoConvert === "object") {
      taskVideoConvert = queue.value.task_video_convert.value;
    }
    let taskVideoMove = queue.value.task_video_move;
    if (typeof taskVideoMove === "object") {
      taskVideoMove = queue.value.task_video_move.value;
    }
    let taskChatDownload = queue.value.task_chat_download;
    if (typeof taskChatDownload === "object") {
      taskChatDownload = queue.value.task_chat_download.value;
    }
    let taskChatRender = queue.value.task_chat_render;
    if (typeof taskChatRender === "object") {
      taskChatRender = queue.value.task_chat_render.value;
    }
    let taskChatMove = queue.value.task_chat_move;
    if (typeof taskChatMove === "object") {
      taskChatMove = queue.value.task_chat_move.value;
    }
    let taskChatConvert = queue.value.task_chat_convert;
    if (typeof taskChatConvert === "object") {
      taskChatConvert = queue.value.task_chat_convert.value;
    }

    // Editing queue
    await useApi(`/api/v1/queue/${queue.value.id}`, {
      method: "PUT",
      credentials: "include",
      body: {
        processing: queue.value.processing,
        live_archive: queue.value.live_archive,
        on_hold: queue.value.on_hold,
        video_processing: queue.value.video_processing,
        chat_processing: queue.value.chat_processing,
        task_vod_create_folder: taskVodCreateFolder,
        task_vod_download_thumbnail: taskVodDownloadThumbnail,
        task_vod_save_info: taskVodSaveInfo,
        task_video_download: taskVideoDownload,
        task_video_convert: taskVideoConvert,
        task_video_move: taskVideoMove,
        task_chat_download: taskChatDownload,
        task_chat_convert: taskChatConvert,
        task_chat_render: taskChatRender,
        task_chat_move: taskChatRender,
      },
    });

    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "Queue Item Edited",
      life: 3000,
    });

    queueDialog.value = false;
    queue.value = {};
    refreshqueues();
  } catch (error) {
    console.error("Error editing queue item: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error editing queue item",
      life: 3000,
    });
  }
};

const editqueue = (prod) => {
  queue.value = { ...prod };
  queue.value.edit = true;
  queueDialog.value = true;
};
const confirmDeletequeue = (prod) => {
  queue.value = prod;
  deletequeueDialog.value = true;
};
const deletequeue = async () => {
  try {
    await useApi(`/api/v1/queue/${queue.value.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    deletequeueDialog.value = false;
    queue.value = {};

    refreshqueues();

    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "Queue Item Deleted",
      life: 3000,
    });
  } catch (error) {
    console.error("Error deleting queue: " + error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error deleting queue item",
      life: 3000,
    });
  }
};

const confirmDeleteSelected = () => {
  deletequeuesDialog.value = true;
};
const deleteSelectedqueues = async () => {
  for (const queue of selectedqueues.value) {
    try {
      await useApi(`/api/v1/queue/${queue.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error(`Error deleting queue ${queue.name}: `, error);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: `Error deleting queue: ${queue.name}`,
        life: 3000,
      });
    }
  }

  deletequeuesDialog.value = false;
  selectedqueues.value = null;
  refreshqueues();
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "queues Deleted",
    life: 3000,
  });
};
</script>

<style lang="scss" scoped>
.task-status-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
}
.type-running {
  background-color: #b3e5fc;
  color: #23547b;
}
.type-pending {
  background-color: #eccfff;
  color: #694382;
}
.type-success {
  background-color: #c8e6c9;
  color: #256029;
}

.type-failed {
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
