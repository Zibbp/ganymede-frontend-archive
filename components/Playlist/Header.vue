<template>
  <div class="w-h-auto w-bg-lara-200 dark:w-bg-lara-800 dark:w-text-lara-200">
    <div class="w-flex w-items-center w-justify-center w-w-full w-h-full">
      <div class="w-text-center align-middle">
        <p class="w-text-4xl w-pt-2 w-pb-2 w-font-bold align-middle">
          {{ props.playlist.name }}
        </p>
        <p class="w-mx-auto w-pb-2 md:w-max-w-screen-md">
          {{ props.playlist.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  playlist: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
