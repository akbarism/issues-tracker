<template>
  <q-card flat class="rounded-lg response_dialog" style="position: relative">
    <q-card-section>
      <div class="text-h6">Give a reponse</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="mb-3" v-if="vm.listAct.length">
        <p class="q-mb-none text-weight-medium">Pilih tindakan</p>
        <q-select
          outlined
          v-model="form.type"
          :options="vm.listAct"
          color="orange"
          dense
        />
      </div>
      <div class="mb-3" v-if="form.type.label == 'Photo'">
        <q-btn
          unelevated
          color="primary"
          :label="vm.img ? 'Cari foto yang lain' : `Upload Foto`"
          icon="mdi-camera"
          size="sm"
          class="mt-3"
          @click="$refs.file.click()"
        >
          <input
            type="file"
            ref="file"
            @change="onUpload($event)"
            accept="image/*"
            class="input_hide"
          />
        </q-btn>
        <p class="q-mb-none small_txt text-red">{{ vm.errImg }}</p>
      </div>
      <div class="mb-3" v-else>
        <p class="q-mb-none text-weight-medium">Catatan</p>
        <q-editor v-model="form.catatan" min-height="5rem" />
        <q-checkbox
          v-model="vm.sendWa"
          v-if="form.type.label == 'Fixed'"
          label="Kirim ke grup"
          color="blue"
        />
      </div>
      <div v-if="vm.img">
        <img :src="vm.img" alt="gambar" style="height: 150px" />
        <p class="small_txt">{{ vm.sizeImg }} MB</p>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <div style="min-width: 300px">
        <q-btn
          v-if="form.type"
          @click="validate"
          unelevated
          class="text-capitalize"
          label="Submit"
          color="blue"
          size="md"
        />
      </div>
    </q-card-actions>
    <backdrop v-if="vm.sending" />
  </q-card>
</template>

<script setup>
import { setDoc, doc, getDocs, collection } from "@firebase/firestore";
import {
  getStorage,
  ref as fbRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { reactive, onMounted } from "vue";
import Backdrop from "../components/Backdrop.vue";
import day from "../plugins/Dayjs";
import db from "../plugins/firebase";
import { mainStore } from "../store/pinia";
const store = mainStore();
const props = defineProps({
  dialog: Boolean,
  id: null,
  issue: null,
});
const vm = reactive({
  sending: false,
  listAct: [],
  sendWa: false,
  file: null,
  img: null,
  sizeImg: "",
  errImg: "",
});
const emit = defineEmits(["close", "fetchLog"]);

const fetchData = async () => {
  vm.sending = true;
  const res = await getDocs(collection(db, "response-type"));
  let arr = [];
  res.forEach((el) => arr.push(el.data()));
  vm.listAct = arr;
  vm.sending = false;
};
const form = reactive({
  type: "",
  catatan: "",
  path: "",
});

const validate = () => {
  if (form.type.label == "Photo") {
    submitPhoto();
  } else {
    sendLog();
  }
};
const sendLog = async () => {
  vm.sending = true;
  let now = day().unix();
  let log = `LOG-${now}`;

  await setDoc(doc(db, "issue", props.id, "logs", log), {
    id: log,
    activity: form.type?.value,
    catatan: form.catatan,
    img: form.path,
    icon: form.type?.icon,
    by: store.user.name,
    createdAt: day().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
  });
  emit("fetchLog");
  emit("close");
  if (vm.sendWa) {
    botWa();
  }
  vm.sending = false;
};

const botWa = () => {
  const author = `*${store.user.name}* menandai sebuah issue sebagai "Fixed" \n \n`;
  const title = `judul : ${props.issue.title}\n\n`;
  const link = `Check detailnya di https://tracking-issue.netlify.app/issue/${props.id}`;
  let body = {
    message: `${author}${title}${link}`,
  };
  store.postWa(body);
};

const onUpload = (e) => {
  const { files } = e.target;
  vm.file = files[0];
  vm.sizeImg = (vm.file.size / 1048576).toFixed(2);
  if (vm.sizeImg > 2) {
    vm.img = null;
    vm.errImg = `Ukuran gambar (${vm.sizeImg}MB), terlalu besar! Maksimal : 2MB`;
  } else {
    vm.errImg = "";
    const reader = new FileReader();
    reader.readAsDataURL(vm.file);
    reader.onload = () => {
      vm.img = reader.result;
    };
  }
};

const submitPhoto = () => {
  vm.sending = true;

  const storage = getStorage();
  const storageRef = fbRef(storage, `evidence/${day().unix()}-${vm.file.name}`);

  uploadBytes(storageRef, vm.file).then((snapshot) => {
    getDownloadURL(storageRef).then((path) => {
      form.path = path;
      sendLog();
    });
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style></style>
