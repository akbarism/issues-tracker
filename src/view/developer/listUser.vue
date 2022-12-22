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
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="setUpdate(item)"
            />
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
    <div class="py-2">
      <q-dialog v-model="vm.dialog">
        <q-card
          class="rounded-lg pa-5"
          flat
          bordered
          style="position: relative; width: 400px"
        >
          <Backdrop v-if="vm.loading" />
          <p class="q-mb-none">Nama</p>
          <q-input
            outlined
            dense
            v-model="vm.item.name"
            color="orange"
            class="rounded-lg mb-3"
          />

          <div class="row justify-center">
            <div
              v-for="(item, i) in vm.avatars"
              :key="`ava-${i}`"
              class="ma-2 cursor-pointer"
              @click="vm.item.ava = item.ava"
            >
              <img
                :src="item.ava"
                :class="`${vm.item.ava == item.ava ? 'bordered' : ''} avatars`"
                alt="ava"
              />
            </div>
          </div>

          <div class="row justify-end mt-3">
            <q-btn
              @click="updateData"
              unelevated
              class="text-capitalize"
              label="Submit"
              color="blue"
              size="sm"
            />
          </div>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script setup>
import db from "../../plugins/firebase.js";
import {
  collection,
  orderBy,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { reactive, onMounted } from "vue";
import Backdrop from "../../components/Backdrop.vue";
const vm = reactive({
  data: [],
  loading: false,
  item: null,
  dialog: false,
  avatars: [],
});
const fetchData = async () => {
  vm.loading = true;
  const res = await getDocs(collection(db, "user"));
  let arr = [];
  res.forEach((el) => arr.push(el.data()));
  vm.data = arr;
  vm.loading = false;
};
const setUpdate = (item) => {
  vm.item = Object.assign({}, item);
  vm.dialog = true;
};
const getAva = async () => {
  const res = await getDocs(collection(db, "avatar"));
  res.forEach((el) => vm.avatars.push(el.data()));
};

const updateData = async () => {
  vm.loading = true;
  await updateDoc(doc(db, "user", vm.item.id), {
    name: vm.item.name,
    ava: vm.item.ava,
  });
  vm.dialog = false;
  fetchData();
};
onMounted(() => {
  fetchData();
  getAva();
});
</script>

<style scoped>
.avatars {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.bordered {
  border: 2px solid #2196f3;
}
</style>
