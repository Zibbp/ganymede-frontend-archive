<template>
  <div>
    <Head>
      <Link
        v-if="!isDark"
        rel="stylesheet"
        href="/theme/lara-light-purple"
      ></Link>
      <Link v-else rel="stylesheet" href="/theme/lara-dark-purple"></Link>
    </Head>
    <NuxtLayout><NuxtPage /></NuxtLayout>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";

const { $bus } = useNuxtApp();

const isDark = useDark();

$bus.$on("toggleDark", (dark) => {
  isDark.value = dark.value;
});
</script>

<style>
* {
  font-family: "Inter", sans-serif;
}
</style>
