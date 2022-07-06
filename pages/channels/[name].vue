<template>
  <div>
    <VodHeader :name="channel.display_name" />
    <div class="w-container w-mx-auto">
      <div v-if="pending">Loading VOds...</div>
      <div v-else>
        <VodSection :vods="vods"></VodSection>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig().public;

const { data: channel } = await useFetch(
  `${config.apiURL}/api/v1/channel/name/${route.params.name}`
);

const {
  data: vods,
  pending,
  refresh,
} = await useLazyAsyncData(`vods-${channel.value.id}`, () =>
  $fetch(`${config.apiURL}/api/v1/vod?channel_id=${channel.value.id}`)
);
</script>

<style lang="scss" scoped></style>
