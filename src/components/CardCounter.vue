<template>
  <q-card flat class="mb-2 rounded-lg">
    <q-card-section>
      <div class="row justify-between mb-3">
        <p class="text-weight-bold ml-1 q-mb-none">
          Issue's <span class="text-primary">Tracker</span>
        </p>
        <q-btn
          size="sm"
          color="primary"
          unelevated
          class="text-capitalize"
          style="height: max-content"
          @click="$emit('create')"
        >
          New Issue
        </q-btn>
      </div>
      <div class="row" v-if="store.count">
        <div class="col-6 pr-2">
          <q-card flat class="rounded-lg bg-grey-3 pa-2 row">
            <q-card
              class="pa-3 rounded-lg bg-deep-orange mr-3"
              style="width: max-content"
            >
              <q-icon
                name="mdi-checkbox-blank-circle-outline"
                color="white"
              ></q-icon>
            </q-card>
            <div class="flexy">
              <p class="q-mb-none text-weight-bold">{{ store.count.open }}</p>
              <p class="q-mb-none small_txt text-weight-medium">Open Issue</p>
            </div>
          </q-card>
        </div>
        <div class="col-6 pl-2">
          <q-card flat class="rounded-lg bg-grey-3 pa-2 row">
            <q-card
              class="pa-3 rounded-lg bg-deep-purple-9 mr-3"
              style="width: max-content"
            >
              <q-icon name="mdi-check-circle-outline" color="white"></q-icon>
            </q-card>
            <div class="flexy">
              <p class="q-mb-none text-weight-bold">{{ store.count.close }}</p>
              <p class="q-mb-none small_txt text-weight-medium">Closed Issue</p>
            </div>
          </q-card>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-6 pr-2">
          <q-skeleton height="60px" class="rounded-lg mb-3" type="QSlider" />
        </div>
        <div class="col-6 pl-2">
          <q-skeleton height="60px" class="rounded-lg mb-3" type="QSlider" />
        </div>
      </div>
      <div class="row justify-end mt-1">
        <q-btn
          flat
          size="sm"
          color="primary"
          unelevated
          class="text-capitalize text-weight-large pa-0"
          style="height: max-content; width: fit-content"
        >
          view statistic
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { mainStore } from "../store/pinia";
const store = mainStore();
const emit = defineEmits(["create"]);

onMounted(() => {
  store.counterIssue();
});
</script>

<style></style>
