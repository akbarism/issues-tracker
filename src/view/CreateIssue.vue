<template>
  <div class="row justify-center">
    <div class="break_point q-py-md">
      <div class="row justify-between align-center mb-3">
        <q-btn
          unelevated
          class="text-capitalize text-black mr-2"
          label="back"
          color="white"
          size="sm"
          @click="router.go(-1)"
        />
        <div class="row items-center mb-3">
          <q-icon name="mdi-plus-circle"></q-icon>
          <p class="text-weight-bold ml-1 q-mb-none">New Issue</p>
        </div>
      </div>
      <q-card class="rounded-lg" flat bordered style="position: relative">
        <Backdrop v-if="vm.loading" />
        <q-card-section>
          <div class="mb-3">
            <p class="q-mb-none text-weight-medium">Title (required)</p>
            <q-input
              outlined
              dense
              v-model="form.title"
              color="orange"
              class="rounded-lg"
            />
          </div>
          <div class="mb-3" v-if="project.length" style="width: 60%">
            <p class="q-mb-none text-weight-medium">Project</p>
            <q-select
              outlined
              v-model="form.project"
              :options="project"
              color="orange"
              dense
            />
          </div>
          <div class="mb-3">
            <p class="q-mb-none text-weight-medium">Description</p>
            <q-editor v-model="form.deskripsi" min-height="5rem" />
          </div>
          <div class="row justify-end">
            <q-btn
              @click="createData"
              unelevated
              class="text-capitalize"
              label="Submit New Issue"
              color="blue"
              size="md"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { inject, onMounted } from "@vue/runtime-core";
import { collection, setDoc, getDocs, doc } from "firebase/firestore";
import db from "../plugins/firebase.js";
import Backdrop from "../components/Backdrop.vue";
import day from "../plugins/Dayjs";
import { mainStore } from "../store/pinia";
import { useRouter } from "vue-router";
const router = useRouter();
const store = mainStore();
const vm = reactive({
  loading: false,
  issues: [],
});
const form = reactive({
  title: "",
  project: "",
  deskripsi: "",
});
const fetchData = async () => {
  vm.loading = true;
  const res = await getDocs(collection(db, "issue"));
  res.forEach((el) => {
    vm.issues.push({ ...el.data(), id: el.id });
  });
  vm.loading = false;
};

const project = ref([]);
const fetchProjcect = async () => {
  const res = await getDocs(collection(db, "project"));
  res.forEach((el) => project.value.push(el.data().name));
};
const createData = async () => {
  vm.loading = true;
  let id = "";
  let now = day().format("DDMMYY");
  if (vm.issues.length > 0) {
    let lastId = vm.issues.length;
    id = `V${lastId + 1}-${now}-${day().unix()}`;
  } else {
    id = `V${vm.issues.length + 1}-${now}-${day().unix()}`;
  }

  await setDoc(doc(db, "issue", id), {
    id: id,
    title: form.title,
    project: form.project,
    deskripsi: form.deskripsi,
    by: store.user.name,
    createdAt: day().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
    status: "open",
    day: day().format("DD"),
    month: day().format("MM-YYYYY"),
    reopen: null,
  });

  for (let i in form) {
    form[i] = "";
  }
  vm.loading = false;
  router.push(`/issue/${id}`);
};

onMounted(() => {
  fetchData();
  fetchProjcect();
});
</script>

<style></style>
