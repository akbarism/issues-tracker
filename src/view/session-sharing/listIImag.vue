<template>
  <div class="row justify-center">
    <div class="break_point q-py-md">
      <div v-if="list.length">
        <q-card
          class="pa-3 mb-3 rounded-lg"
          v-for="(item, i) in list"
          :key="`item-${i}`"
        >
          <img
            :src="`${pathImg}/${item.backdrop_path}`"
            class="lazy_img"
            loading="lazy"
          />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
import axios from "axios";
const API_KEY = "dc5ccb94e96da9e2ca80888a86e032a3";
const baseUrl = "https://api.themoviedb.org/3/";
const pathImg = "http://image.tmdb.org/t/p/original";
const list = ref([]);
const getData = () => {
  axios
    .get(`${baseUrl}/movie/popular?api_key=${API_KEY}`)
    .then((res) => {
      list.value = res.data.results;
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {
  getData();
});
</script>

<style scoped>
.lazy_img {
  height: 300px;
  width: 100%;
}
</style>
