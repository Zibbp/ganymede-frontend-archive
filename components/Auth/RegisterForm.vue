<template>
  <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
    <div class="w-text-center align-middle mb-5 w-mx-auto">
      <img
        src="/images/ganymede_logo.png"
        alt="Image"
        class="w-w-12 w-mx-auto"
      />
      <div class="text-900 text-3xl font-medium mb-3">Create An Account</div>
      <span class="text-600 font-medium line-height-3">Have an account?</span>
      <NuxtLink to="/login"
        ><a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
          >Login</a
        ></NuxtLink
      >
    </div>
    <form @submit.prevent="login()">
      <div>
        <label for="email1" class="block text-900 font-medium mb-2"
          >Username</label
        >
        <InputText
          id="username"
          v-model="username"
          type="text"
          class="w-full mb-3"
          autocomplete="username"
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
          autoComplete="current-password"
          required
        />

        <Button
          label="Sign Up"
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
    .register(username.value, password.value)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "You have successfully registered, you may now sign in.",
        life: 3000,
      });
      router.push("/login");
    })
    .catch((err) => {
      console.error("Error signing up");
      console.error(err);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: err.response.data.message,
        life: 3000,
      });
    });
};
</script>

<style lang="scss" scoped></style>
