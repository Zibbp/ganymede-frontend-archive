<template>
  <div>
    <AdminVodsTable />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth-guard", "admin-role-guard"],
});
</script>

<style lang="scss" scoped></style>
