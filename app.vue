<template>
  <div class="w-bg-lara-100 dark:w-bg-lara-900 body-class">
    <Head>
      <link
        v-if="!isDark"
        rel="stylesheet"
        type="text/css"
        href="/theme/lara-light-purple"
      />
      <link
        v-else
        rel="stylesheet"
        type="text/css"
        href="/theme/lara-dark-purple"
      />
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

<style lang="scss">
* {
  font-family: "Inter", sans-serif;
}
light-theme {
  background-color: #eff3f7;
}
dark-theme {
  background-color: #040d19;
}
.body-class {
  min-height: 100vh;
}
</style>
