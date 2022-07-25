<template>
  <div class="w-container w-mx-auto">
    <AdminVodsTable />
  </div>
</template>

<script setup>
import { useAuthGuard, useRoleGuard } from "~/composables/useGuard";

useHead({
  title: "Admin - VODs",
});

onMounted(() => {
  useAuthGuard();
  useRoleGuard("admin");
});
</script>

<style lang="scss" scoped></style>
