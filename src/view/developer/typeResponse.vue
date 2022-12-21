<template>
  <div>
    <div class="row justify-between mb-3">
      <p class="text-weight-bold ml-1 q-mb-none">Response Type</p>
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
          <div class="row items-center">
            <q-avatar
              size="md"
              :icon="item.icon"
              color="blue-grey-2"
              text-color="blue-grey-5"
            >
            </q-avatar>
            <div class="ml-3">
              <p class="q-mb-none text-weight-medium">
                {{ item.label }}
              </p>
              <p class="q-mb-none small_txt text-grey">
                {{ item.value }}
              </p>
            </div>
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
                form.label = item.label;
                form.value = item.value;
                form.icon = item.icon;
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
          <form @submit.prevent="postData">
            <p class="q-mb-none">Tulis Label</p>
            <q-input
              outlined
              dense
              v-model="form.label"
              color="orange"
              class="rounded-lg mb-3"
            />
            <p class="q-mb-none">Tulis Value</p>
            <q-input
              outlined
              dense
              v-model="form.value"
              color="orange"
              class="rounded-lg mb-3"
            />
            <p class="q-mb-none">
              Pilih icon di
              <a
                href="https://fonts.google.com/icons"
                target="_blank"
                rel="noopener noreferrer"
                >sini</a
              >
            </p>
            <q-input
              outlined
              dense
              v-model="form.icon"
              color="orange"
              class="rounded-lg"
            />
            <div class="row justify-end mt-3">
              <q-btn
                type="submit"
                unelevated
                class="text-capitalize"
                label="Submit"
                color="blue"
                size="sm"
              />
            </div>
          </form>
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
import day from "../../plugins/Dayjs";
const vm = reactive({
  data: [],
  loading: false,
  dialog: false,
  name: "",
  type: "",
  item: null,
});
const form = reactive({
  label: "",
  value: "",
  icon: "",
});
const fetchData = async () => {
  vm.loading = true;
  const res = await getDocs(collection(db, "response-type"));
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
  let id = `response-${day().unix()}`;
  await setDoc(doc(db, "response-type", id), {
    id: id,
    label: form.label,
    value: form.value,
    icon: form.icon,
    createdAt: day().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
  });
  vm.dialog = false;

  form.label = "";
  form.value = "";
  form.icon = "";
  fetchData();
};
const updateData = async () => {
  vm.loading = true;
  await updateDoc(doc(db, "response-type", vm.item.id), {
    label: form.label,
    value: form.value,
    icon: form.icon,
  });
  vm.dialog = false;
  fetchData();
};
const deleteData = async () => {
  await deleteDoc(doc(db, "response-type", vm.item.id));
  fetchData();
};
onMounted(() => {
  fetchData();
});
</script>
