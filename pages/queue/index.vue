<template>
  <div class="w-container w-mx-auto w-mt-4">
    <div><QueueSection /></div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth-guard", "archiver-role-guard"],
});
</script>

<style lang="scss" scoped></style>
