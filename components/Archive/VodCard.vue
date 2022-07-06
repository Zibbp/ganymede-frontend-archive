<template>
  <div class="w-mb-3">
    <div>
      <img :src="thumbnailUrl" alt="Preview Vod Thumbnail" />
    </div>
    <div class="w-mt-2">
      {{ props.vod.title }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  vod: {
    type: Object,
    required: true,
  },
});
const thumbnailUrl = props.vod.thumbnail_url
  .replace("%{width}", "320")
  .replace("%{height}", "180");
</script>

<style lang="scss" scoped></style>
