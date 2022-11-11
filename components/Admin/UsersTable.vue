<template>
  <div>
    <!-- <div v-if="pending">Loading...</div> -->
    <div>
      <div>
        <div class="card">
          <Toolbar>
            <template #start>
              <Button
                @click="refreshusers"
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
                :disabled="!selectedusers || !selectedusers.length"
            /></template>
          </Toolbar>

          <DataTable
            ref="dt"
            :value="users"
            v-model:selection="selectedusers"
            dataKey="id"
            :loading="loading"
            :paginator="true"
            :rows="15"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[15, 25, 50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
            responsiveLayout="scroll"
            :rowHover="rowHover"
          >
            <template #header>
              <div
                class="table-header flex flex-column md:flex-row md:justiify-content-between"
              >
                <h5 class="mb-2 md:m-0 p-as-md-center">Manage Users</h5>
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

            <Column field="username" header="Username" :sortable="true">
              <template #body="slotProps">
                <span :title="slotProps.data.username" class="w-line-clamp-1">{{
                  slotProps.data.username
                }}</span>
              </template>
            </Column>

            <Column field="role" header="Role" :sortable="true">
              <template #body="slotProps">
                <span :title="slotProps.data.role" class="w-line-clamp-1">{{
                  slotProps.data.role
                }}</span>
              </template>
            </Column>

            <Column field="method" header="Method" :sortable="true">
              <template #body="slotProps">
                <span :title="slotProps.data.oauth" class="w-line-clamp-1">
                  <span
                    v-if="slotProps.data.oauth"
                    :class="'user-auth-method-badge method-oauth'"
                    >OAUTH</span
                  >
                  <span v-else :class="'user-auth-method-badge method-local'"
                    >LOCAL</span
                  >
                </span>
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
                  @click="edituser(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-warning"
                  @click="confirmDeleteuser(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <Dialog
          v-model:visible="userDialog"
          :style="{ width: '450px' }"
          header="User"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="username">Username</label>
            <InputText
              id="username"
              v-model.trim="user.username"
              required="true"
              :class="{ 'p-invalid': submitted && !user.username }"
            />
            <small class="p-error" v-if="submitted && !user.username"
              >Username is required.</small
            >
          </div>

          <div class="field">
            <label for="role">Role</label>
            <Dropdown
              id="role"
              v-model="user.role"
              :options="userRoles"
              optionLabel="label"
              placeholder="Select a Role"
              required="true"
              :class="{ 'p-invalid': submitted && !user.role }"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span
                    :class="'user-role-badge type-' + slotProps.value.value"
                    >{{ slotProps.value.label.toUpperCase() }}</span
                  >
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span
                    :class="
                      'user-role-badge type-' + slotProps.value.toLowerCase()
                    "
                    >{{ slotProps.value.toUpperCase() }}</span
                  >
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-error" v-if="submitted && !user.role"
              >Role is required.</small
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
              @click="createuser"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteuserDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="confirmation-content">
            <div v-if="user">
              Are you sure you want to delete user <b>{{ user.username }}</b
              >?
            </div>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteuserDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteuser"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteusersDialog"
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
              <span v-if="user"
                >Are you sure you want to delete the selected users?</span
              >
            </div>
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteusersDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedusers"
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
  data: users,
  refresh,
} = useLazyAsyncData("admin-users", () =>
  useApi(`/api/v1/user`, {
    method: "GET",
    credentials: "include",
  }).catch((error) => {
    console.error("Error fetching user: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error fetching users",
      life: 3000,
    });
  })
);

const dt = ref();
const rowHover = ref(true);
const userDialog = ref(false);
const deleteuserDialog = ref(false);
const deleteusersDialog = ref(false);
const user = ref({});
const selectedusers = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const loading = ref(false);

const userRoles = ref([
  { label: "admin", value: "admin" },
  { label: "editor", value: "editor" },
  { label: "archiver", value: "archiver" },
  { label: "user", value: "user" },
]);

const refreshusers = () => {
  loading.value = true;
  refresh();
  loading.value = false;
};

const hideDialog = () => {
  userDialog.value = false;
  submitted.value = false;
};

const createuser = async () => {
  submitted.value = true;
  try {
    // If role is changed set it
    let userRole = user.value.role;
    if (typeof userRole === "object") {
      userRole = user.value.role.value;
    }

    // Editing user
    await useApi(`/api/v1/user/${user.value.id}`, {
      method: "PUT",
      credentials: "include",
      body: {
        username: user.value.username,
        role: userRole,
      },
    });

    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "User Edited",
      life: 3000,
    });

    userDialog.value = false;
    user.value = {};
    refreshusers();
  } catch (error) {
    console.error("Error editing user: ", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error editing user",
      life: 3000,
    });
  }
};

const edituser = (prod) => {
  user.value = { ...prod };
  user.value.edit = true;
  userDialog.value = true;
};
const confirmDeleteuser = (prod) => {
  user.value = prod;
  deleteuserDialog.value = true;
};
const deleteuser = async () => {
  try {
    await useApi(`/api/v1/user/${user.value.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    deleteuserDialog.value = false;
    user.value = {};

    refreshusers();

    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "User Deleted",
      life: 3000,
    });
  } catch (error) {
    console.error("Error deleting user: " + error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error deleting user",
      life: 3000,
    });
  }
};

const confirmDeleteSelected = () => {
  deleteusersDialog.value = true;
};
const deleteSelectedusers = async () => {
  for (const user of selectedusers.value) {
    try {
      await useApi(`/api/v1/user/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error(`Error deleting user ${user.name}: `, error);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: `Error deleting user: ${user.name}`,
        life: 3000,
      });
    }
  }

  deleteusersDialog.value = false;
  selectedusers.value = null;
  refreshusers();
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Users Deleted",
    life: 3000,
  });
};
</script>

<style lang="scss" scoped>
.user-auth-method-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
}

.method-oauth {
  background-color: #eccfff;
  color: #694382;
}

.method-local {
  background-color: #b3e5fc;
  color: #23547b;
}

.user-role-badge {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
}
.type-archiver {
  background-color: #b3e5fc;
  color: #23547b;
}
.type-editor {
  background-color: #eccfff;
  color: #694382;
}
.type-user {
  background-color: #c8e6c9;
  color: #256029;
}

.type-admin {
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
