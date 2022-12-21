<template>
  <div>
    <div class="row justify-between mb-3">
      <p class="text-weight-bold ml-1 q-mb-none">User List</p>
      <router-link to="/register" class="text-decoration-none">
        <q-btn
          size="sm"
          color="primary"
          unelevated
          class="text-capitalize"
          style="height: max-content"
        >
          Add User
        </q-btn>
      </router-link>
    </div>
    <div v-if="!vm.loading">
      <div v-if="vm.data.length">
        <q-card
          class="pa-3 rounded-lg mb-3 row justify-between"
          bordered
          flat
          v-for="(item, i) in vm.data"
          :key="i"
        >
          <div class="row items-center t">
            <q-avatar>
              <img :src="item.ava" alt="ava" />
            </q-avatar>
            <div class="ml-3 mt-1">
              <p class="q-mb-none text-weight-medium">
                {{ item.name }}
              </p>
              <p class="q-mb-none small_txt text-grey">
                {{ item.email }} ({{
                  item.role == 1
                    ? "Developer"
                    : item.role == 2
                    ? "Stack Holder"
                    : "QA"
                }})
              </p>
            </div>
          </div>
          <div>
            <q-btn flat round color="primary" icon="edit" />
          </div>
        </q-card>
      </div>
    </div>
    <div v-else>
      <q-skeleton
        height="70px"
        v-for="i in 3"
        :key="`loading${i}`"
        class="rounded-lg mb-3"
        type="QSlider"
      />
    </div>
  </div>
</template>
<script setup>
import db from "../../plugins/firebase.js";
import { collection, orderBy, query, where, getDocs } from "firebase/firestore";
import { reactive, onMounted } from "vue";
const vm = reactive({
  data: [],
  loading: false,
});
const fetchData = async () => {
  vm.loading = true;
  const res = await getDocs(collection(db, "user"));
  let arr = [];
  res.forEach((el) => arr.push(el.data()));
  vm.data = arr;
  vm.loading = false;
};

onMounted(() => {
  fetchData();
});
</script>
