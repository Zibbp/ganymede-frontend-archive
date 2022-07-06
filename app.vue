<template>
  <div>
    <Head>
      <Link
        v-if="!isDark"
        rel="stylesheet"
        href="/node_modules/primevue/resources/themes/lara-light-purple/theme.css"
      ></Link>
      <Link
        v-else
        rel="stylesheet"
        href="/node_modules/primevue/resources/themes/lara-dark-purple/theme.css"
      ></Link>
    </Head>
    <NuxtLayout v-if="loaded"><NuxtPage /></NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/AuthStore";
import { useDark } from "@vueuse/core";
import { ref } from "vue";
const { $bus } = useNuxtApp();

const isDark = useDark();

$bus.$on("toggleDark", (dark) => {
  isDark.value = dark.value;
});

const authStore = useAuthStore();

const loaded = ref(false);

onMounted(async () => {
  await authStore.init();
  console.log("App Vue Init DOne");
  loaded.value = true;
});
</script>

<style>
* {
  font-family: "Inter", sans-serif;
}
</style>
