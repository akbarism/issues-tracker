<template>
  <div>
    <div v-for="(log, i) in logs" :key="`log-${i}`">
      <div class="row">
        <q-avatar
          size="md"
          :icon="log.icon"
          color="blue-grey-2"
          text-color="blue-grey-5"
        >
        </q-avatar>
        <div class="flexy ml-3 mt-1">
          <p class="small_txt q-mb-none">
            <span class="text-weight-bold mr-1">{{ log.by }}</span>
            <span class="text-weight-medium text-dark"
              >{{ log.activity }} {{ day(log.createdAt).fromNow() }}</span
            >
          </p>
        </div>
      </div>
      <div class="connector_outer">
        <div class="connector pl-3 pb-3">
          <q-card class="rounded-lg" flat bordered v-if="log.catatan">
            <div class="bg-grey-2 pa-2 small_txt text-weight-medium">
              Catatan
            </div>
            <div class="pa-2">
              <p class="small_txt q-mb-none" v-html="log.catatan"></p>
            </div>
          </q-card>
          <q-card class="rounded-lg" flat bordered v-if="log.img">
            <div class="px-2 py-2">
              <img :src="log.img" alt="anu" style="width: 100%;" class="rounded" />
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import day from "../plugins/Dayjs.js";
defineProps({
  logs: null,
});
</script>

<style></style>
