<template>
  <div>
    <div class="row justify-between mb-3">
      <p class="text-weight-bold ml-1 q-mb-none">Project List</p>
      <q-btn
        size="sm"
        color="primary"
        unelevated
        class="text-capitalize"
        style="height: max-content"
        @click="
          vm.dialog = true;
          vm.type = 'create';
        "
      >
        Add Data
      </q-btn>
    </div>
    <div v-if="!vm.loading">
      <div v-if="vm.data.length">
        <q-card
          class="pa-3 rounded-lg mb-3 row justify-between items-center"
          bordered
          flat
          v-for="(item, i) in vm.data"
          :key="i"
        >
          <div class="row">
            <p class="q-mb-none text-weight-medium" style="width: 30px">
              {{ i + 1 }}.
            </p>
            <p class="q-mb-none text-weight-medium">
              {{ item.name }}
            </p>
          </div>
          <div class="row">
            <q-btn
              flat
              round
              color="primary"
              size="sm"
              icon="edit"
              @click="
                vm.dialog = true;
                vm.type = 'update';
                vm.name = item.name;
                vm.item = item;
              "
            />
            <q-btn
              flat
              round
              color="red"
              size="sm"
              icon="delete"
              @click="
                vm.item = item;
                deleteData();
              "
            />
          </div>
        </q-card>
      </div>
    </div>
    <div v-else>
      <q-skeleton
        height="50px"
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
          style="position: relative; width: 350px"
        >
          <Backdrop v-if="vm.loading" />

          <p>Tulis Nama Project</p>
          <q-input
            outlined
            dense
            v-model="vm.name"
            @keyup.enter="postData"
            color="orange"
            class="rounded-lg"
          />
          <div class="row justify-end mt-3">
            <q-btn
              @click="postData"
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
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { reactive, onMounted } from "vue";
import Backdrop from "../../components/Backdrop.vue";
import { async } from "@firebase/util";
import day from "../../plugins/Dayjs";
const vm = reactive({
  data: [],
  loading: false,
  dialog: false,
  name: "",
  type: "",
  item: null,
});
const fetchData = async () => {
  vm.loading = true;
  const res = await getDocs(collection(db, "project"));
  let arr = [];
  res.forEach((el) => arr.push(el.data()));
  vm.data = arr;
  vm.loading = false;
};
const postData = () => {
  if (vm.type == "create") {
    createData();
  } else {
    updateData();
  }
};
const createData = async () => {
  vm.loading = true;
  let id = `project-${day().unix()}`;
  await setDoc(doc(db, "project", id), {
    id: id,
    name: vm.name,
    createdAt: day().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
  });
  vm.dialog = false;
  vm.name = "";
  fetchData();
};
const updateData = async () => {
  vm.loading = true;
  await updateDoc(doc(db, "project", vm.item.id), {
    name: vm.name,
  });
  vm.dialog = false;
  fetchData();
};
const deleteData = async () => {
  await deleteDoc(doc(db, "project", vm.item.id));
  fetchData();
};
onMounted(() => {
  fetchData();
});
</script>
