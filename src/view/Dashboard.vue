<template>
  <div>
    <CardCounter @create="validateCreate" />
    <div class="row justify-between">
      <div class="row items-center mb-3">
        <q-icon size="sm" name="mdi-source-pull"></q-icon>
        <p class="text-weight-bold ml-1 q-mb-none">Open Issue</p>
      </div>

      <router-link to="/all-issue">
        <q-btn
          flat
          size="sm"
          color="primary"
          unelevated
          class="text-capitalize text-weight-large"
          style="height: max-content"
        >
          View All
        </q-btn>
      </router-link>
    </div>
    <div v-if="!vm.loading">
      <div v-if="vm.issue.length">
        <q-card
          class="rounded-lg mb-3"
          v-for="(item, i) in vm.issue"
          :key="`issue-${i}`"
          flat
          bordered
        >
          <ItemIssue :item="item" />
        </q-card>
      </div>
    </div>
    <div v-else>
      <q-skeleton
        height="80px"
        v-for="i in 3"
        :key="`loading${i}`"
        class="rounded-lg mb-3"
        type="QSlider"
      />
    </div>
    <div class="py-2">
      <q-dialog v-model="vm.dialog">
        <Login
          :dialog="vm.dialog"
          @close="vm.dialog = false"
          @redirect="router.push('/create')"
        />
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import CardCounter from "../components/CardCounter.vue";
import ItemIssue from "../components/ItemIssue.vue";
import day from "../plugins/Dayjs";
import { useRoute, useRouter } from "vue-router";
import { mainStore } from "../store/pinia";
import { onMounted, reactive } from "@vue/runtime-core";
import {
  collection,
  setDoc,
  getDocs,
  where,
  doc,
  orderBy,
  query,
  getDoc,
} from "firebase/firestore";
import db from "../plugins/firebase.js";
const vm = reactive({
  issue: [],
  loading: true,
  dialog: false,
});
const store = mainStore();
const router = useRouter();
const route = useRoute();
const validateCreate = () => {
  if (store.uid) {
    router.push("/create");
  } else {
    vm.dialog = true;
  }
};

const fetchData = async () => {
  vm.loading = true;
  let q = query(
    collection(db, "issue"),
    orderBy("createdAt", "desc"),
    where("status", "==", "open"),
  );
  const res = await getDocs(q);
  let data = [];
  res.forEach((el) => {
    data.push(el.data());
  });
  vm.issue = data;
  vm.loading = false;
};

onMounted(() => {
  fetchData();
});
</script>
