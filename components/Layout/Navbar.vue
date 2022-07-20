<template>
  <div class="ganymede-navbar">
    <Menubar :model="items" class="ganymede-menubar">
      <template #start>
        <img
          alt="logo"
          src="/images/ganymede_logo.png"
          height="40"
          class="w-h-11"
        />
      </template>
      <Menubar :model="items">
        <template #item="{ item }">
          <NuxtLink
            v-if="authStore.user.role == item.role"
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
        <InputText
          placeholder="Search"
          v-model="searchQuery"
          v-on:keyup.enter="searchVods"
        />
        <Button
          v-if="isDark"
          @click="toggleDark()"
          icon="pi pi-sun"
          class="p-button-rounded p-button-text p-button-plain p-button-lg"
        />
        <Button
          v-else
          @click="toggleDark()"
          icon="pi pi-moon"
          class="p-button-rounded p-button-text p-button-plain p-button-lg"
        />
        <span v-if="authStore.isAuthenticated">
          <NuxtLink to="/profile">
            <Button
              icon="pi pi-user"
              class="p-button-rounded p-button-text p-button-plain p-button-lg"
            />
          </NuxtLink>
        </span>
        <span v-else>
          <NuxtLink to="/login" class="w-ml-2">
            <Button label="Login" class="p-button-help" />
          </NuxtLink>
        </span>
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

const searchQuery = ref();

const toggleDark = () => {
  useToggleDark();
  $bus.$emit("toggleDark", isDark);
};

const authStore = useAuthStore();

const searchVods = async () => {
  if (searchQuery.value != "") {
    await navigateTo({
      path: "/search",
      query: {
        q: searchQuery.value,
      },
    });
    searchQuery.value = "";
  }
};

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
    visible: () => {
      let visibleBoolean;
      if (authStore.isAuthenticated) {
        visibleBoolean =
          authStore.user.role === "archiver" ||
          authStore.user.role === "editor" ||
          authStore.user.role === "admin";
      } else {
        visibleBoolean = false;
      }
      return visibleBoolean;
    },
  },
  {
    label: "Queue",
    to: "/queue",
    visible: () => {
      let visibleBoolean;
      if (authStore.isAuthenticated) {
        visibleBoolean =
          authStore.user.role === "archiver" ||
          authStore.user.role === "editor" ||
          authStore.user.role === "admin";
      } else {
        visibleBoolean = false;
      }
      return visibleBoolean;
    },
  },
  {
    label: "Admin",
    icon: "pi pi-fw",
    items: [
      { label: "Home", icon: "pi pi-home", to: "/admin" },
      { label: "Vods", icon: "pi pi-video", to: "/admin/vods" },
      { label: "Live", icon: "pi pi-video", to: "/admin/live" },

      { label: "Queue", icon: "pi pi-align-justify", to: "/admin/queue" },
      { label: "Channels", icon: "pi pi-id-card", to: "/admin/channels" },
      { label: "Users", icon: "pi pi-user", to: "/admin/users" },
      { label: "Settings", icon: "pi pi-cog", to: "/admin/settings" },
    ],
    visible: () => {
      let visibleBoolean;
      if (authStore.isAuthenticated) {
        visibleBoolean = authStore.user.role === "admin";
      } else {
        visibleBoolean = false;
      }
      return visibleBoolean;
    },
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
