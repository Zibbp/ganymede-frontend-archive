<template>
  <div>
    <div>
      <AdminStats />
    </div>
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
