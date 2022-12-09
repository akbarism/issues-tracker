<template>
  <div class="row justify-center">
    <div class="break_point">
      <div class="py-3 row justify-between items-center mb-3">
        <q-avatar>
          <img :src="ava" />
        </q-avatar>
        <q-btn
          size="sm"
          unelevated
          icon="mdi-dots-vertical"
          round
          style="height: max-content"
          @click="logout"
        >
        </q-btn>
      </div>
      <div class="row justify-between">
        <div class="row items-center mb-3">
          <q-icon size="sm" name="mdi-source-pull"></q-icon>
          <p class="text-weight-bold ml-1 q-mb-none">Today's Issue</p>
        </div>

        <q-btn
          size="sm"
          color="primary"
          unelevated
          class="text-capitalize"
          style="height: max-content"
          @click="validateCreate"
        >
          New Issue
        </q-btn>
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
            <q-card-section class="row justify-between no-wrap">
              <div>
                <p
                  class="text-weight-bold q-mb-none title_"
                  @click="toDetail(item.id)"
                >
                  {{ item.title }}
                </p>
                <p class="xsmall_txt q-mb-none text-grey mr-1">
                  #{{ item.id }} on
                  {{ day(item.created_at).format("DD MMMM YYYY") }}
                </p>
              </div>
              <div class="column items-end">
                <!-- <q-btn
                  color="deep-orange"
                  class="text-capitalize mb-2 px-2"
                  unelevated
                  size="sm"
                  rounded
                  style="height: max-content"
                >
                  <div class="row no-wrap">
                    <q-icon
                      class="mr-1"
                      name="mdi-checkbox-blank-circle-outline"
                    ></q-icon>
                    open
                  </div>
                </q-btn> -->
                <q-btn
                  :color="
                    item.status == 'open' ? 'deep-orange' : 'deep-purple-9'
                  "
                  class="text-capitalize px-2"
                  unelevated
                  size="sm"
                  rounded
                  style="height: max-content"
                >
                  <div class="row no-wrap">
                    <q-icon
                      class="mr-1"
                      :name="`mdi-${
                        item.status == 'open'
                          ? 'checkbox-blank-circle-outline'
                          : 'check-circle-outline'
                      }`"
                    ></q-icon>
                    {{ item.status }}
                  </div>
                </q-btn>
              </div>
            </q-card-section>
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
  </div>
</template>
<script setup>
import { onMounted, reactive } from "@vue/runtime-core";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import db from "../plugins/firebase.js";
import ava from "../assets/img/jihoy.jpg";
import day from "../plugins/Dayjs";
import { useRoute, useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { mainStore } from "../store/pinia";
const store = mainStore();
const router = useRouter();
const route = useRoute();
const vm = reactive({
  issue: [],
  loading: true,
  dialog: false,
});

const auth = getAuth();
const logout = () => {
  signOut(auth);
};

const validateCreate = () => {
  if (store.uid) {
    router.push("/create");
  } else {
    vm.dialog = true;
  }
};

const fetchData = async () => {
  vm.loading = true;
  const res = await getDocs(
    collection(db, "issue"),
    orderBy("createdAt", "desc"),
  );
  let data = [];
  res.forEach((el) => {
    data.push(el.data());
  });
  vm.issue = data;
  vm.loading = false;
};

const toDetail = (id) => {
  router.push(`/issue/${id}`);
};

onMounted(() => {
  fetchData();
});
</script>
<style scoped>
.title_:hover {
  color: #ff9800;
  cursor: pointer;
}
</style>
