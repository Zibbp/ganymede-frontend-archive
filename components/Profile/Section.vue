<template>
  <div class="w-flex w-items-center w-justify-center">
    <div
      class="w-w-1/3 w-mt-4 w-bg-lara-200 w-p-4 w-rounded-lg dark:w-bg-lara-800 dark:w-text-light-400"
    >
      <div class="w-text-3xl w-text-center">
        {{ props.user.username }}
      </div>
      <div class="w-text-center">
        <Tag class="w-mt-2" :value="user.role"></Tag>
      </div>
      <div>
        <div v-if="!authStore.oauth"><ProfileChangePassword /></div>
        <div v-else>Account managed via OAuth</div>
      </div>
      <div class="w-mt-4">
        <Button
          @click="logout"
          label="Logout"
          class="p-button-danger w-w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Tag from "primevue/tag";
import Button from "primevue/button";
import { useAuthStore } from "~/stores/AuthStore";

const authStore = useAuthStore();

const config = useRuntimeConfig().public;

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const logout = () => {
  if (authStore.oauth) {
    window.location.href = `${config.apiURL}/api/v1/auth/oauth/logout`;
  } else {
    authStore.logout();
  }
};
</script>

<style lang="scss" scoped></style>
