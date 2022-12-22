<template>
  <div>
    <div class="q-py-md" v-if="store.uid">
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
          <div v-if="form.project == 'Teman Bakat'">
            <div class="mb-3 row">
              <div
                v-for="(item, i) in listLayanan"
                :key="`listLayanan-${i}`"
                class="px-3 py-2 mx-1 rounded max-content text-weight-medium cursor_pointer"
                @click="
                  form.tipe_layanan = item;
                  form.layanan = '';
                "
                :style="`background: ${
                  form.tipe_layanan == item ? '#2196f3' : '#fafafa'
                }; color: ${form.tipe_layanan == item ? '#fff' : '#000'}`"
              >
                {{ item }}
              </div>
            </div>
            <div
              class="mb-3"
              v-if="form.tipe_layanan == 'Psikotes'"
              style="width: 60%"
            >
              <p class="q-mb-none text-weight-medium">List Psikotes</p>
              <q-select
                outlined
                v-model="form.layanan"
                :options="vm.psikotes"
                color="orange"
                dense
              />
            </div>
            <div
              class="mb-3"
              v-if="form.tipe_layanan == 'Konsultasi'"
              style="width: 60%"
            >
              <p class="q-mb-none text-weight-medium">List Konsultasi</p>
              <q-select
                outlined
                v-model="form.layanan"
                :options="vm.konsultasi"
                color="orange"
                dense
              />
            </div>
          </div>
          <div class="mb-3" v-if="form.project" style="width: 60%">
            <p class="q-mb-none text-weight-medium">Kendala</p>
            <q-select
              outlined
              v-model="form.kendala"
              :options="vm.kendala"
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
    <div class="row justify-center" v-else>
      <Login />
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
import axios from "axios";
const router = useRouter();
const store = mainStore();
const listLayanan = ["Psikotes", "Konsultasi", "Lainya"];
const vm = reactive({
  loading: false,
  issues: [],
  psikotes: [],
  konsultasi: [],
  kendala: [],
});
const form = reactive({
  title: "",
  project: "",
  deskripsi: "",
  tipe_layanan: "",
  layanan: "",
  kendala: "",
});
const fetchData = async () => {
  vm.loading = true;
  const res = await getDocs(collection(db, "issue"));
  res.forEach((el) => {
    vm.issues.push({ ...el.data(), id: el.id });
  });
  vm.loading = false;
};

const getPsikotes = () => {
  store
    .getApi("admin/psikotes-setting")
    .then((res) =>
      res.data.data.forEach((el) => vm.psikotes.push(el.nama_psikotes)),
    );
};
const getKonsultasi = () => {
  store
    .getApi("admin/konsultasi")
    .then((res) =>
      res.data.data.forEach((el) => vm.konsultasi.push(el.nama_konsultasi)),
    );
};
const kendala = async () => {
  const res = await getDocs(collection(db, "kendala"));
  let arr = [];
  res.forEach((el) => arr.push(el.data().name));
  vm.kendala = arr;
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
    tipe_layanan: form.tipe_layanan,
    layanan: form.layanan,
    kendala: form.kendala,
  });
  forwardToDiscord(id);

  for (let i in form) {
    form[i] = "";
  }
  vm.loading = false;
  router.push(`/issue/${id}`);
};

const forwardToDiscord = (id) => {
  let body = {
    content: `Sial! si ${store.user.name} bikin issue gays!. \n nih linknya : https://tracking-issue.netlify.app/issue/${id} \n @everyone`,
  };
  store.postDiscord(body)
};

onMounted(() => {
  getPsikotes();
  fetchData();
  fetchProjcect();
  getKonsultasi();
  kendala();
});
</script>

<style scoped>
.cursor_pointer {
  cursor: pointer;
}
</style>
