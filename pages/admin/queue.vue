<template>
  <div class="w-container w-mx-auto">
    <AdminQueueTable />
  </div>
</template>

<script setup>
import { useAuthGuard, useRoleGuard } from "~/composables/useGuard";

onMounted(() => {
  useAuthGuard();
  useRoleGuard("admin");
});
</script>

<style lang="scss" scoped></style>
