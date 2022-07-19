<template>
  <div>
    <form @submit.prevent="changePasswordReq()">
      <div class="field">
        <label for="old_password">Old Password</label>
        <InputText
          id="old_password"
          class="w-w-full"
          type="password"
          v-model="changePassword.old_password"
          aria-describedby="old-password"
          autocomplete="current-password"
          required
        />
      </div>

      <div class="field">
        <label for="new_password">New Password</label>
        <InputText
          id="new_password"
          class="w-w-full"
          type="password"
          v-model="changePassword.new_password"
          aria-describedby="new-password"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="field">
        <label for="confirm_new_password">Confirm New Password</label>
        <InputText
          id="confirm_new_password"
          class="w-w-full"
          type="password"
          v-model="changePassword.confirm_new_password"
          aria-describedby="confirm_new-password"
          autocomplete="new-password"
          required
        />
      </div>
      <div>
        <Button label="Submit" type="submit" />
      </div>
    </form>
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { useApi } from "~/composables/useApi";

const toast = useToast();

const changePassword = ref({});

const changePasswordReq = async () => {
  if (
    changePassword.value.new_password !==
    changePassword.value.confirm_new_password
  ) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Passwords do not match",
      life: 3000,
    });
    return;
  }

  try {
    const resp = await useApi("/api/v1/auth/change-password", {
      method: "POST",
      body: changePassword.value,
      credentials: "include",
    });
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Password changed",
      life: 3000,
    });
  } catch (error) {
    console.error("Error changing password: ", error);
    console.log(error.response);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response._data.message,
      life: 3000,
    });
  }
};
</script>

<style lang="scss" scoped></style>
