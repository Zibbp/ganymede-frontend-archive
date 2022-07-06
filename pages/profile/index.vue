<template>
  <div>Your Profile :) {{ authStore.user.username }}</div>
</template>

<script setup>
import { useAuthStore } from "~/stores/AuthStore";

definePageMeta({
  middleware: ["auth-guard"],
});

const authStore = useAuthStore();
</script>

<style lang="scss" scoped></style>
