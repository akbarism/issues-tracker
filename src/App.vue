<script setup>
import { onMounted } from "@vue/runtime-core";
import { mainStore } from "./store/pinia";
const store = mainStore();

onMounted(() => {
  store.checkAuth();
});
</script>

<template>
  <q-layout>
    <q-page-container>
      <router-view class="bg_default"></router-view>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
