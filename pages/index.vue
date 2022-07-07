<template>
  <div class="p-component">
    <h5>Basic</h5>
    <Button @click="testApi()" label="Submit" />
    <Button label="Disabled" disabled="true" />
    <Button label="Link" class="p-button-link" />
    <h5>Addons</h5>
    <div class="grid p-fluid">
      <div class="col-12 md:col-4">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-user"></i>
          </span>
          <InputText placeholder="Username" />
        </div>
      </div>
    </div>
    <div>pos: {{ x }}, {{ y }}</div>
    <Button label="DARK" @click="toggleDark()" />
    <div class="dark:text-green-400">Is Dark: {{ isDark }}</div>
    <div class="p-inputgroup">
      <InputText class="dark:w-bg-neutral-700" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { useApi } from "~/composables/useApi";

const isDark = useDark();
const toggleDark = useToggle(isDark);
const { x, y } = useMouse();

const testApi = async () => {
  try {
    const test = await useApi("/api/v1/channel", {
      method: "POST",
      body: {
        name: "fetch-api1",
        display_name: "Fetch API1",
        image_path: "/vods/zibbp/profile.png",
      },
      credentials: "include",
    });
  } catch (error) {
    console.log("INDEX ERROR:", error.data.message);
  }
};
</script>

<style lang="scss">
body {
  background-color: var(--surface-0);
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--text-color);
}
* {
  $inputBg: red;
}

::v-deep(.dark.p-inputtext) {
  .p-inputtext {
    background: #212121;
    $inputBg: #212121;
  }
}
</style>
