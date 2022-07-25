<template>
  <div class="w-container w-mx-auto w-mt-4">
    <div><QueueSection /></div>
  </div>
</template>

<script setup>
import { useAuthGuard, useRoleGuard } from "~/composables/useGuard";

useHead({
  title: "Queue - Ganymede",
});

onMounted(() => {
  useAuthGuard();
  useRoleGuard("archiver");
});
</script>

<style lang="scss" scoped></style>
