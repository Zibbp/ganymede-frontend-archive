<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else>
      <div>
        <div class="card">
          <Toolbar class="mb-4">
            <template #start>
              <Button
                label="New"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew"
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteSelected"
                :disabled="!selectedProducts || !selectedProducts.length"
              />
            </template>

            <template #end>
              <FileUpload
                mode="basic"
                accept="image/*"
                :maxFileSize="1000000"
                label="Import"
                chooseLabel="Import"
                class="mr-2 inline-block"
              />
              <Button
                label="Export"
                icon="pi pi-upload"
                class="p-button-help"
                @click="exportCSV($event)"
              />
            </template>
          </Toolbar>

          <DataTable
            ref="dt"
            :value="vods"
            v-model:selection="selectedProducts"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            responsiveLayout="scroll"
            :rowHover="rowHover"
          >
            <template #header>
              <div
                class="table-header flex flex-column md:flex-row md:justiify-content-between"
              >
                <h5 class="mb-2 md:m-0 p-as-md-center">Manage Products</h5>
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
            <Column
              field="id"
              header="ID"
              :sortable="true"
              style="max-width: 5rem"
            >
              <template #body="slotProps">
                <span :title="slotProps.data.id" class="w-line-clamp-1">{{
                  slotProps.data.id
                }}</span>
              </template>
            </Column>
            <Column field="ext_id" header="Ext ID" :sortable="true"></Column>
            <Column
              header="Channel"
              sortable
              filterField="edges.channel.display_name"
              sortField="edges.channel.display_name"
            >
              <template #body="{ data }">
                <img
                  :src="config.cdnURL + data.edges.channel.image_path"
                  width="30"
                  style="vertical-align: middle"
                  class="w-inline border-circle"
                />
                <span class="image-text">{{
                  data.edges.channel.display_name
                }}</span>
              </template>
            </Column>
            <Column
              field="title"
              header="Title"
              :sortable="true"
              style="max-width: 25rem"
            >
              <template #body="slotProps">
                <span :title="slotProps.data.title" class="w-line-clamp-1">{{
                  slotProps.data.title
                }}</span>
              </template>
            </Column>

            <Column field="type" header="Type" :sortable="true">
              <template #body="slotProps">
                <span
                  :class="
                    'vod-type-badge type-' +
                    (slotProps.data.type
                      ? slotProps.data.type.toLowerCase()
                      : '')
                  "
                  >{{ slotProps.data.type.toUpperCase() }}</span
                >
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
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editProduct(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-warning"
                  @click="confirmDeleteProduct(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <Dialog
          v-model:visible="vodDialog"
          :style="{ width: '450px' }"
          header="VOD"
          :modal="true"
          class="p-fluid"
        >
          <img
            v-if="vod.edit"
            :src="config.cdnURL + vod.web_thumbnail_path"
            class="product-image border-round-sm w-mb-1"
          />
          <div class="field">
            <label for="id">ID</label>
            <InputText id="id" v-model="vod.id" disabled />
          </div>
          <div class="field">
            <label for="ext_id"
              >External ID
              <i @click="randExtId()" class="pi pi-sync w-cursor-pointer"></i
            ></label>
            <InputText
              id="ext_id"
              v-model.trim="vod.ext_id"
              required="true"
              :class="{ 'p-invalid': submitted && !vod.ext_id }"
            />
          </div>
          <div class="field">
            <label for="title">Title</label>
            <InputText
              id="title"
              v-model.trim="vod.title"
              required="true"
              :class="{ 'p-invalid': submitted && !vod.title }"
            />
            <small class="p-error" v-if="submitted && !vod.title"
              >Title is required.</small
            >
          </div>

          <div class="field">
            <label for="type">Type</label>
            <Dropdown
              id="tyle"
              v-model="vod.type"
              :options="vodTypes"
              optionLabel="label"
              placeholder="Select a Type"
              required="true"
              :class="{ 'p-invalid': submitted && !vod.type }"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span
                    :class="'vod-type-badge type-' + slotProps.value.value"
                    >{{ slotProps.value.label.toUpperCase() }}</span
                  >
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span
                    :class="
                      'vod-type-badge type-' + slotProps.value.toLowerCase()
                    "
                    >{{ slotProps.value.toUpperCase() }}</span
                  >
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-error" v-if="submitted && !vod.type"
              >Type is required.</small
            >
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label for="duration">Duration (seconds)</label>
              <InputNumber
                id="duration"
                v-model="vod.duration"
                integeronly
                required="true"
                :useGrouping="useGrouping"
                :class="{ 'p-invalid': submitted && !vod.duration }"
              />
              <small class="p-error" v-if="submitted && !vod.duration"
                >Duration is required.</small
              >
            </div>
            <div class="field col">
              <label for="views">Views</label>
              <InputNumber
                id="views"
                v-model="vod.views"
                integeronly
                required="true"
                :useGrouping="useGrouping"
                :class="{ 'p-invalid': submitted && !vod.views }"
              />
              <small class="p-error" v-if="submitted && !vod.views"
                >Views is required.</small
              >
            </div>
          </div>

          <div class="field">
            <label for="resolution">Resolution</label>
            <InputText
              id="resolution"
              v-model.trim="vod.resolution"
              required="true"
              :class="{ 'p-invalid': submitted && !vod.resolution }"
            />
            <small class="p-error" v-if="submitted && !vod.resolution"
              >Resolution is required.</small
            >
          </div>

          <div class="field">
            <label for="streamed_at">Streamed At</label>
            <Calendar
              id="streamed_at"
              v-model="vod.streamed_at"
              required="true"
              dateFormat="yy-mm-dd"
              :class="{ 'p-invalid': submitted && !vod.streamed_at }"
            />
            <small class="p-error" v-if="submitted && !vod.streamed_at"
              >Streamed At is required.</small
            >
          </div>

          <div class="field">
            <label for="thumbnail_path">Thumbnail Path</label>
            <InputText
              id="thumbnail_path"
              v-model.trim="vod.thumbnail_path"
              :title="vod.thumbnail_path"
            />
          </div>
          <div class="field">
            <label for="web_thumbnail_path">Web Thumbnail Path</label>
            <InputText
              id="web_thumbnail_path"
              v-model.trim="vod.web_thumbnail_path"
              :title="vod.web_thumbnail_path"
              required="true"
              :class="{ 'p-invalid': submitted && !vod.web_thumbnail_path }"
            />
          </div>
          <div class="field">
            <label for="video_path">Video Path</label>
            <InputText
              id="video_path"
              v-model.trim="vod.video_path"
              :title="vod.video_path"
              required="true"
              :class="{ 'p-invalid': submitted && !vod.video_path }"
            />
          </div>
          <div class="field">
            <label for="chat_path">Chat Path</label>
            <InputText
              id="chat_path"
              v-model.trim="vod.chat_path"
              :title="vod.chat_path"
            />
          </div>

          <div class="field">
            <label for="chat_video_path">Chat Video Path</label>
            <InputText
              id="chat_video_path"
              v-model.trim="vod.chat_video_path"
              :title="vod.chat_video_path"
            />
          </div>

          <div class="field">
            <label for="info_path">Info Path</label>
            <InputText
              id="info_path"
              v-model.trim="vod.info_path"
              :title="vod.info_path"
            />
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
              @click="saveProduct"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deletevodDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="product"
              >Are you sure you want to delete <b>{{ vod.name }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deletevodDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteProduct"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteProductsDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span v-if="product"
              >Are you sure you want to delete the selected products?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteProductsDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedProducts"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
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
import { v4 as uuidv4 } from "uuid";

import { useApi } from "~/composables/useApi";
import dayjs from "dayjs/esm";
const config = useRuntimeConfig().public;

const { pending, data: vods } = useLazyAsyncData("admin-vods", () =>
  useApi(`/api/v1/vod`, {
    method: "GET",
    credentials: "include",
  })
);

const toast = useToast();
const dt = ref();
const rowHover = ref(true);
const useGrouping = ref(false);
const products = ref();
const vodDialog = ref(false);
const deletevodDialog = ref(false);
const deleteProductsDialog = ref(false);
const vod = ref({});
const selectedProducts = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const vodTypes = ref([
  { label: "archive", value: "archive" },
  { label: "live", value: "live" },
  { label: "highlight", value: "highlight" },
  { label: "upload", value: "upload" },
  { label: "clip", value: "clip" },
]);

const formatCurrency = (value) => {
  if (value)
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  return;
};
const randExtId = () => {
  vod.value.ext_id = Math.floor(Math.random() * 1000000000).toString();
};

watch(
  () => [vod.value.ext_id],
  (cV, oV) => {
    if (vod.new) {
      vod.value.thumbnail_path = `/vods/${vod.value.ext_id}_${vod.value.id}/${vod.value.ext_id}-thumbnail.jpg`;
      vod.value.web_thumbnail_path = `/vods/${vod.value.ext_id}_${vod.value.id}/${vod.value.ext_id}-web_thumbnail.jpg`;
      vod.value.video_path = `/vods/${vod.value.ext_id}_${vod.value.id}/${vod.value.ext_id}-video.mp4`;
      vod.value.chat_path = `/vods/${vod.value.ext_id}_${vod.value.id}/${vod.value.ext_id}-chat.json`;
      vod.value.chat_video_path = `/vods/${vod.value.ext_id}_${vod.value.id}/${vod.value.ext_id}-chat.mp4`;
      vod.value.info_path = `/vods/${vod.value.ext_id}_${vod.value.id}/${vod.value.ext_id}-info.json`;
    }
  }
);

const openNew = () => {
  vod.value = {};
  vod.value.id = uuidv4();
  vod.value.new = true;
  submitted.value = false;
  vodDialog.value = true;
};
const hideDialog = () => {
  vodDialog.value = false;
  submitted.value = false;
};
const saveProduct = () => {
  submitted.value = true;

  if (vod.value.name.trim()) {
    if (vod.value.id) {
      vod.value.inventoryStatus = vod.value.inventoryStatus.value
        ? vod.value.inventoryStatus.value
        : vod.value.inventoryStatus;
      products.value[findIndexById(vod.value.id)] = vod.value;
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Updated",
        life: 3000,
      });
    } else {
      vod.value.id = createId();
      vod.value.code = createId();
      vod.value.image = "product-placeholder.svg";
      vod.value.inventoryStatus = vod.value.inventoryStatus
        ? vod.value.inventoryStatus.value
        : "INSTOCK";
      products.value.push(vod.value);
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Created",
        life: 3000,
      });
    }

    vodDialog.value = false;
    vod.value = {};
  }
};
const editProduct = (prod) => {
  vod.value = { ...prod };
  vod.value.edit = true;
  vodDialog.value = true;
};
const confirmDeleteProduct = (prod) => {
  vod.value = prod;
  deletevodDialog.value = true;
};
const deleteProduct = () => {
  products.value = products.value.filter((val) => val.id !== vod.value.id);
  deletevodDialog.value = false;
  vod.value = {};
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Product Deleted",
    life: 3000,
  });
};
const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
};
const createId = () => {
  let id = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};
const exportCSV = () => {
  dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
  products.value = products.value.filter(
    (val) => !selectedProducts.value.includes(val)
  );
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Products Deleted",
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
  display: flex;
  align-items: center;
  justify-content: center;
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
