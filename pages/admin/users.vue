<template>
  <div class="w-container w-mx-auto">
    <AdminUsersTable />
  </div>
</template>

<script setup>
import { useAuthGuard, useRoleGuard } from "~/composables/useGuard";

useHead({
  title: "Admin - Users",
});

onMounted(() => {
  useAuthGuard();
  useRoleGuard("admin");
});
</script>

<style lang="scss" scoped></style>
