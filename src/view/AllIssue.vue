<template>
  <div class="row justify-center">
    <div class="break_point">
      <Navbar />
      <div class="row mb-3">
        <div v-for="(item, i) in tabs" :key="`tab-${i}`">
          <q-btn
            @click="changeTab(item)"
            unelevated
            class="text-capitalize mr-2 rounded-lg"
            :label="item"
            :flat="vm.state != item"
            :color="vm.state == item ? 'blue' : 'grey'"
            size="md"
          />
        </div>
      </div>
      <div v-if="!vm.loading">
        <div v-if="store.issue.length">
          <q-card
            class="rounded-lg mb-3"
            v-for="(item, i) in store.issue"
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
    </div>
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import Navbar from "../components/Navbar.vue";
import { mainStore } from "../store/pinia";
import { collection, orderBy, query, where } from "firebase/firestore";
import { onMounted } from "@vue/runtime-core";
import db from "../plugins/firebase";
import ItemIssue from "../components/ItemIssue.vue";

const store = mainStore();
const tabs = ["open", "closed", "all issue"];
const vm = reactive({
  loading: false,
  state: "open",
  project: "",
});
const changeTab = (item) => {
  vm.state = item;
  fetchData();
};
const fetchData = async () => {
  vm.loading = true;
  let q = null;
  if (vm.state != "all issue") {
    if (vm.project) {
      q = query(
        collection(db, "issue"),
        orderBy("createdAt", "desc"),
        where("status", "==", vm.state),
        where("project", "==", vm.project),
      );
    } else {
      q = query(
        collection(db, "issue"),
        orderBy("createdAt", "desc"),
        where("status", "==", vm.state),
      );
    }
  } else {
    if (vm.project) {
      q = query(
        collection(db, "issue"),
        orderBy("createdAt", "desc"),
        where("project", "==", vm.project),
      );
    } else {
      q = query(collection(db, "issue"), orderBy("createdAt", "desc"));
    }
  }
  await store.getIssue(q);
  vm.loading = false;
};
onMounted(() => {
  fetchData();
});
</script>

<style></style>
