<template>
  <div>Your Profile :) {{ authStore.user.username }}</div>
</template>

<script setup>
import { useAuthStore } from "~/stores/AuthStore";
import { useAuthGuard } from "~/composables/useGuard";

onMounted(() => {
  useAuthGuard();
});

const authStore = useAuthStore();
</script>

<style lang="scss" scoped></style>
