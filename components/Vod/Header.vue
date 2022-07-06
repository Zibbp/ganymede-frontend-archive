<template>
  <div class="w-w-full w-h-24 vods-header">
    <div class="w-flex w-items-center w-justify-center w-w-full w-h-full">
      <div class="w-text-center align-middle">
        <p
          class="w-text-4xl !w-font-bold w-text-white w-font-bold align-middle"
        >
          {{ props.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.vods-header {
  background: rgb(24, 10, 47);
  background: linear-gradient(
    107deg,
    rgba(24, 10, 47, 1) 0%,
    rgba(76, 29, 149, 1) 60%,
    rgba(109, 40, 217, 1) 100%
  );
}
</style>
