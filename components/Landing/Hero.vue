<template>
  <div>
    <div class="grid grid-nogutter surface-section text-800">
      <div
        class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center"
      >
        <section>
          <span class="block text-6xl font-bold mb-1">Archive Twitch</span>
          <div class="text-6xl text-primary font-bold mb-3">
            Livestreams and VODs
          </div>
          <p class="mt-0 mb-4 text-700 line-height-3">
            Open source, friendly file saving format, and a rendered chat for
            each archive.
          </p>

          <NuxtLink v-if="!authStore.isAuthenticated" to="/login">
            <Button
              label="Login"
              type="button"
              class="mr-3 p-button-raised"
            ></Button
          ></NuxtLink>
          <NuxtLink
            v-if="isPermissions()"
            to="/archive"
          >
            <Button
              label="Archive"
              type="button"
              class="mr-3 p-button-raised"
            ></Button
          ></NuxtLink>
          <NuxtLink to="/channels">
            <Button
              label="Channels"
              type="button"
              class="p-button-outlined"
            ></Button
          ></NuxtLink>
        </section>
      </div>
      <div class="col-12 md:col-6 overflow-hidden">
        <img
          src="/images/ganymede-hero.png"
          alt="Image"
          class="md:ml-auto block md:h-full"
          style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/AuthStore";
const authStore = useAuthStore();

const isPermissions = () => {
  let visibleBoolean;
  if (authStore.isAuthenticated) {
    if (authStore.user.role === "archiver" || authStore.user.role === "editor" || authStore.user.role === "admin") {
      visibleBoolean = true;
    } 
  } else {
    visibleBoolean = false;
  }
  return visibleBoolean;
};
</script>

<style lang="scss" scoped></style>
