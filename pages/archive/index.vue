<template>
  <div class="w-container w-mx-auto">
    <div class="w-flex w-items-center w-justify-center w-mt-8">
      <div class="w-text-center align-middle">
        <ArchiveSection />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth-guard", "archiver-role-guard"],
});
</script>

<style lang="scss" scoped></style>
