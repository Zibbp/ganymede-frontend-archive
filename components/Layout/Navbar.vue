<template>
  <div class="ganymede-navbar">
    <Menubar :model="items" class="ganymede-menubar">
      <template #start>
        <img
          alt="logo"
          src="/static/images/ganymede_logo.png"
          height="40"
          class="w-h-11"
        />
      </template>
      <Menubar :model="items">
        <template #item="{ item }">
          <NuxtLink
            :to="item.to"
            custom
            v-slot="{ href, route, navigate, isActive, isExactActive }"
          >
            <a
              :href="href"
              @click="navigate"
              :class="{
                'active-link': isActive,
                'active-link-exact': isExactActive,
              }"
              >{{ route.fullPath }}</a
            >
          </NuxtLink>
        </template>
      </Menubar>
      <template #end>
        <InputText placeholder="Search" />
        <Button
          v-if="isDark"
          @click="toggleDark()"
          icon="pi pi-sun"
          class="p-button-rounded p-button-text p-button-plain p-button-lg"
        />
        <Button
          v-if="!isDark"
          @click="toggleDark()"
          icon="pi pi-moon"
          class="p-button-rounded p-button-text p-button-plain p-button-lg"
        />
        <NuxtLink v-if="authStore.isAuthenticated" to="/profile">
          <Button
            icon="pi pi-user"
            class="p-button-rounded p-button-text p-button-plain p-button-lg"
          />
        </NuxtLink>
        <NuxtLink v-if="!authStore.isAuthenticated" to="/login" class="w-ml-2">
          <Button label="Login" class="p-button-help" />
        </NuxtLink>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Menubar from "primevue/menubar";
import { useAuthStore } from "~/stores/AuthStore";
import { useDark, useToggle } from "@vueuse/core";
const { $bus } = useNuxtApp();

const isDark = useDark();
const useToggleDark = useToggle(isDark);

const toggleDark = () => {
  useToggleDark();
  $bus.$emit("toggleDark", isDark);
};

const authStore = useAuthStore();

const items = ref([
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Channels",
    to: "/channels",
  },
  {
    label: "Archive",
    to: "/archive",
  },
  {
    label: "Queue",
    to: "/queue",
  },
  {
    label: "Admin",
    to: "/admin",
  },
  {
    label: "Login",
    to: "/login",
  },
]);
</script>

<style lang="scss" scoped>
::v-deep(.ganymede-menubar.p-menubar) {
  .p-menuitem-link {
    padding: 0.75rem 0.75rem !important;
  }
  border-radius: 0px;
}
.ganymede-navbar {
  height: 4.2rem;
}
</style>
