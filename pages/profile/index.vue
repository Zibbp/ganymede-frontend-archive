<template>
  <div><ProfileSection :user="authStore.user" /></div>
</template>

<script setup>
import { useAuthStore } from "~/stores/AuthStore";
import { useAuthGuard } from "~/composables/useGuard";

useHead({
  title: "Profile - Ganymede",
});

onMounted(() => {
  useAuthGuard();
});

const authStore = useAuthStore();
</script>

<style lang="scss" scoped></style>
