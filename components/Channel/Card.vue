<template>
  <div class="col-12 md:col-2">
    <NuxtLink :to="'/channels/' + props.channel.name">
      <div class="channel-grid-item card">
        <div class="channel-grid-item-content">
          <div>
            <img
              v-show="isImageLoaded"
              @load="imageLoaded"
              class="border-round-xl !w-inline w-border-4 w-border-purple-700 w-border-opacity-0 hover:w-border-opacity-100"
              :src="$config.cdnURL + props.channel.image_path"
              :alt="props.channel.name"
            />
            <Skeleton
              v-show="!isImageLoaded"
              class="border-round-xl"
              width="100%"
              height="229px"
            />
          </div>
          <div class="channel-name w-text-neutral-700 dark:w-text-neutral-200">
            {{ props.channel.display_name }}
          </div>
        </div>
      </div></NuxtLink
    >
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";

const config = useRuntimeConfig().public;

const props = defineProps({
  channel: {
    type: Object,
    required: true,
  },
});

const isImageLoaded = ref(false);
const imageLoaded = () => {
  isImageLoaded.value = true;
};
</script>

<style lang="scss" scoped>
.card {
  padding: 2rem;

  margin-bottom: 2rem;
}
.p-dropdown {
  width: 14rem;
  font-weight: normal;
}

.channel-name {
  font-size: 1.5rem;
  font-weight: 700;
}

.channel-description {
  margin: 0 0 1rem 0;
}

.channel-category-icon {
  vertical-align: middle;
  margin-right: 0.5rem;
}

.channel-category {
  font-weight: 600;
  vertical-align: middle;
}

::v-deep(.channel-list-item) {
  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;

  img {
    width: 50px;
  }

  .channel-list-detail {
    flex: 1 1 0;
  }

  .p-rating {
    margin: 0 0 0.5rem 0;
  }

  .channel-price {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    align-self: flex-end;
  }

  .channel-list-action {
    display: flex;
    flex-direction: column;
  }

  .p-button {
    margin-bottom: 0.5rem;
  }
}

::v-deep(.channel-grid-item) {
  margin: 0.5rem;

  .channel-grid-item-top,
  .channel-grid-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  img {
    margin: 0.5rem 0;
  }

  .channel-grid-item-content {
    text-align: center;
  }

  .channel-price {
    font-size: 1.5rem;
    font-weight: 600;
  }
}

@media screen and (max-width: 576px) {
  .channel-list-item {
    flex-direction: column;
    align-items: center;

    img {
      margin: 2rem 0;
    }

    .channel-list-detail {
      text-align: center;
    }

    .channel-price {
      align-self: center;
    }

    .channel-list-action {
      display: flex;
      flex-direction: column;
    }

    .channel-list-action {
      margin-top: 2rem;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
}
</style>
