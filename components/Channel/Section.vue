<template>
  <div class="card">
    <DataView
      class="channel-dataview"
      :value="channels"
      :layout="layout"
      :paginator="true"
      :rows="18"
      :sortOrder="sortOrder"
      :sortField="sortField"
    >
      <template #header>
        <div class="grid grid-nogutter">
          <div class="col-6" style="text-align: left">
            <Dropdown
              v-model="sortKey"
              :options="sortOptions"
              optionLabel="label"
              placeholder="Sort By"
              @change="onSortChange($event)"
            />
          </div>
        </div>
      </template>

      <template #list="slotProps">
        <div class="col-12">
          <div class="channel-list-item">
            <img
              :src="'http://localhost:8000' + slotProps.data.image_path"
              :alt="slotProps.data.name"
            />
            <div class="channel-list-detail">
              <div class="channel-name">{{ slotProps.data.name }}</div>
              <div class="channel-description">
                {{ slotProps.data.description }}
              </div>
              <Rating
                :modelValue="slotProps.data.rating"
                :readonly="true"
                :cancel="false"
              ></Rating>
              <i class="pi pi-tag channel-category-icon"></i
              ><span class="channel-category">{{
                slotProps.data.category
              }}</span>
            </div>
            <div class="channel-list-action">
              <span class="channel-price">${{ slotProps.data.price }}</span>
              <Button
                icon="pi pi-shopping-cart"
                label="Add to Cart"
                :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
              ></Button>
              <span>{{ slotProps.data.inventoryStatus }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <ChannelCard :channel="slotProps.data"></ChannelCard>
      </template>
    </DataView>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import Dropdown from "primevue/dropdown";
import Rating from "primevue/rating";
import Button from "primevue/button";
const config = useRuntimeConfig().public;

const { data: channels, refresh } = await useAsyncData(`channels`, () =>
  $fetch(`${config.apiURL}/api/v1/channel`)
);

// console.log(channels);

const layout = ref("grid");
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
  { label: "Newest to Oldest", value: "!created_at" },
  { label: "Oldest to Newest", value: "created_at" },
  { label: "Alphabetical", value: "name" },
]);
const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = event.value;

  if (value.indexOf("!") === 0) {
    sortOrder.value = -1;
    sortField.value = value.substring(1, value.length);
    sortKey.value = sortValue;
  } else {
    sortOrder.value = 1;
    sortField.value = value;
    sortKey.value = sortValue;
  }
};
</script>

<style lang="scss" scoped>
::v-deep(.channel-dataview.p-dataview) {
  .p-dataview-header {
    background: none;
    border: none;
  }
  .p-paginator-bottom {
    border: none;
  }
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
  margin-top: -2rem;

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
