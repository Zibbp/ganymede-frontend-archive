<template>
  <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
    <div class="w-text-center align-middle mb-5 w-mx-auto">
      <img
        src="/static/images/ganymede_logo.png"
        alt="Image"
        class="w-w-12 w-mx-auto"
      />
      <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
      <span class="text-600 font-medium line-height-3"
        >Don't have an account?</span
      >
      <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
        >Create today!</a
      >
    </div>
    <form @submit.prevent="login()">
      <div>
        <label for="email1" class="block text-900 font-medium mb-2"
          >Email</label
        >
        <InputText
          id="email1"
          v-model="username"
          type="text"
          class="w-full mb-3"
          required
        />

        <label for="password1" class="block text-900 font-medium mb-2"
          >Password</label
        >
        <InputText
          id="password1"
          v-model="password"
          type="password"
          class="w-full mb-3"
          required
        />

        <!-- <div class="flex align-items-center justify-content-between mb-6">
        <div class="flex align-items-center">
          <Checkbox
            id="rememberme1"
            :binary="true"
            v-model="checked"
            class="mr-2"
          ></Checkbox>
          <label for="rememberme1">Remember me</label>
        </div>
        <a
          class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
          >Forgot password?</a
        >
      </div> -->

        <Button
          label="Sign In"
          icon="pi pi-user"
          type="submit"
          class="w-full"
        ></Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";

import { useAuthStore } from "~/stores/AuthStore";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const username = ref("");
const password = ref("");

const login = () => {
  authStore
    .login(username.value, password.value)
    .then(() => {
      navigateTo({ path: "/" });
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message,
        life: 3000,
      });
      console.error("Error logging in: " + error);
    });
};
</script>

<style lang="scss" scoped>
// [type="text"] {
//   background-color: none;
//   border-color: none;
//   border-radius: 0;
//   border-width: 0;
//   font-size: 0;
//   line-height: 0;
//   padding: 0;
// }
</style>
