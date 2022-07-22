<template>
  <div>
    <div class="card">
      <DataView
        class="vod-dataview"
        :value="props.vods"
        :layout="layout"
        :paginator="true"
        :rows="itemsPerPage"
        :sortOrder="sortOrder"
        :sortField="sortField"
        :dataKey="props.vods.id"
      >
        <template #empty>
          <div class="w-flex w-items-center w-justify-center w-w-full w-h-full">
            <div class="w-text-center align-middle">
              <span class="w-flex">
                No VODs found.
                <img
                  src="/images/Sadge.png"
                  alt="Sadge"
                  title="Sadge"
                  class="w-ml-1"
                />
              </span>
            </div>
          </div>
        </template>

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
              <Dropdown
                class="w-ml-1"
                v-model="itemsPerPage"
                :options="itemsPerPageOptions"
                optionLabel="label"
                placeholder="Per Page"
                @change="onItemsPerPageChange($event)"
              >
                <template #value="slotProps">
                  <span v-if="itemsPerPage !== 18">
                    {{ itemsPerPage }}
                  </span>
                </template>
              </Dropdown>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <VodCard
            :key="slotProps.data.id"
            :vod="slotProps.data"
            :playback="playback"
          ></VodCard>
        </template>
      </DataView>
    </div>
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

const props = defineProps({
  vods: {
    type: Array,
    required: true,
  },
  playback: {
    type: Array,
    required: false,
  },
});

const layout = ref("grid");
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const itemsPerPage = ref(18);
const itemsPerPageOptions = ref([
  { label: "18", value: 18 },
  { label: "36", value: 36 },
  { label: "54", value: 54 },
]);
const sortOptions = ref([
  { label: "Date Newest to Oldest", value: "!created_at" },
  { label: "Date Oldest to Newest", value: "created_at" },
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
const onItemsPerPageChange = (event) => {
  itemsPerPage.value = event.value.value;
};
</script>

<style lang="scss" scoped>
::v-deep(.vod-dataview.p-dataview) {
  .p-dataview-header {
    background: none;
    border: none;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .p-paginator-bottom {
    border: none;
  }
}
.card {
  margin-bottom: 2rem;
}
.p-dropdown {
  width: 14rem;
  font-weight: normal;
}

.vod-name {
  font-size: 1.5rem;
  font-weight: 700;
}

.vod-description {
  margin: 0 0 1rem 0;
}

.vod-category-icon {
  vertical-align: middle;
  margin-right: 0.5rem;
}

.vod-category {
  font-weight: 600;
  vertical-align: middle;
}

::v-deep(.vod-list-item) {
  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;

  img {
    width: 50px;
  }

  .vod-list-detail {
    flex: 1 1 0;
  }

  .p-rating {
    margin: 0 0 0.5rem 0;
  }

  .vod-price {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    align-self: flex-end;
  }

  .vod-list-action {
    display: flex;
    flex-direction: column;
  }

  .p-button {
    margin-bottom: 0.5rem;
  }
}

::v-deep(.vod-grid-item) {
  margin: 0.5rem;

  .vod-grid-item-top,
  .vod-grid-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  img {
    margin: 0.5rem 0;
  }

  .vod-price {
    font-size: 1.5rem;
    font-weight: 600;
  }
}

@media screen and (max-width: 576px) {
  .vod-list-item {
    flex-direction: column;
    align-items: center;

    img {
      margin: 2rem 0;
    }

    .vod-list-detail {
      text-align: center;
    }

    .vod-price {
      align-self: center;
    }

    .vod-list-action {
      display: flex;
      flex-direction: column;
    }

    .vod-list-action {
      margin-top: 2rem;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
}
</style>
