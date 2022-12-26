<template>
  <div class="row justify-center relative-position">
    <div class="break_point q-py-md">
      <div class="row items-center justify-between mb-3">
        <q-btn
          unelevated
          class="text-capitalize text-black mr-2"
          label="back"
          color="white"
          size="sm"
          @click="router.go(-1)"
        />
        <div class="row items-center">
          <!-- <q-btn
            unelevated
            class="text-capitalize text-black mr-2"
            label="edit"
            color="white"
            size="sm"
          /> -->
          <q-btn
            unelevated
            class="text-capitalize"
            label="New Issue"
            color="blue"
            size="sm"
            @click="validateCreate"
          />
          <div v-if="store.user && store.user.role == 1">
            <q-btn
              v-if="!vm.deleting"
              unelevated
              class="text-capitalize ml-3"
              label="löschen"
              color="red"
              size="sm"
              @click="delIssue"
            />
            <q-btn
              v-else
              unelevated
              class="text-capitalize ml-3"
              label="Daten löschen..."
              color="red"
              size="sm"
            />
          </div>
        </div>
      </div>
      <div v-if="!vm.loading">
        <div v-if="vm.issue">
          <div class="mb-2">
            <p class="text-weight-bold q-mb-none" style="font-size: 18px">
              {{ vm.issue.title }}
            </p>
            <div class="row items-center justify-between">
              <q-btn
                :color="
                  vm.issue.status == 'open' ? 'deep-orange' : 'deep-purple-9'
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
                      vm.issue.status == 'open'
                        ? 'checkbox-blank-circle-outline'
                        : 'check-circle-outline'
                    }`"
                  ></q-icon>
                  {{ vm.issue.status }}
                </div>
              </q-btn>
              <q-btn
                round
                unelevated
                flat
                color="green"
                icon="mdi-whatsapp"
                @click="onForward"
              />
            </div>

            <p class="xsmall_txt text-grey q-mb-none">
              <span class="text-weight-bold">{{ vm.issue.by }}</span> created
              this issue {{ day(vm.issue.createdAt).fromNow() }}
            </p>
          </div>
          <q-separator class="mb-2" />
          <q-card class="pa-2 rounded-lg mb-2" flat bordered>
            <div class="row justify-between">
              <p class="text-weight-bold q-mb-none">
                {{ vm.issue.project }}
              </p>
              <p v-if="vm.issue.reopen">
                dibuka
                <span class="text-weight-bold">{{ vm.issue.reopen }}x</span>
              </p>
            </div>
            <p class="q-mb-none" v-if="vm.issue.layanan">
              <span class="text-caption">Layanan : </span>
              <span class="text-weight-bold">{{ vm.issue.layanan }}</span>
            </p>
            <p class="q-mb-none">
              <span class="text-caption">Kendala : </span>
              <span class="text-weight-bold">{{ vm.issue.kendala }}</span>
            </p>
          </q-card>
          <q-card class="rounded-lg" flat bordered style="position: relative">
            <q-card-section>
              <p v-html="vm.issue.deskripsi"></p>
              <q-separator />
              <q-btn
                v-if="!vm.issue.img && store.uid"
                unelevated
                color="primary"
                label="Upload Foto"
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
              <div v-else>
                <div class="row justify-center">
                  <img :src="vm.issue.img" alt="anu" class="evidence-img" />
                </div>
                <div v-if="store.user">
                  <q-btn
                    v-if="!vm.delImg"
                    unelevated
                    color="red"
                    label="Delete Foto"
                    icon="mdi-delete"
                    size="sm"
                    class="mt-1"
                    @click="deleteImg(vm.issue.img)"
                  >
                  </q-btn>
                  <q-btn
                    v-else
                    unelevated
                    color="red"
                    label="Deleting..."
                    icon="mdi-delete"
                    size="sm"
                    class="mt-1"
                  >
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <div class="connector_outer">
            <div class="connector row justify-end py-3">
              <div v-if="store.uid">
                <q-btn
                  v-if="!vm.sending"
                  unelevated
                  class="text-capitalize"
                  :label="
                    vm.issue.status == 'open' ? 'Close Issue' : 'Reopen Issue'
                  "
                  :icon="`mdi-${
                    vm.issue.status == 'open'
                      ? 'check-circle-outline'
                      : 'sync-circle'
                  }`"
                  :color="
                    vm.issue.status == 'open' ? 'deep-purple' : 'deep-orange'
                  "
                  size="sm"
                  style="height: max-content"
                  @click="swtichStatus(vm.issue.status)"
                />
                <q-btn
                  v-else
                  unelevated
                  class="text-capitalize"
                  :color="
                    vm.issue.status == 'open' ? 'deep-purple' : 'deep-orange'
                  "
                  size="sm"
                  style="height: max-content"
                >
                  <q-circular-progress indeterminate size="15px" class="mr-2" />
                  Loading ...
                </q-btn>
              </div>
            </div>
          </div>
          <div v-if="vm.log.length">
            <ProgressIssue :logs="vm.log" />
          </div>
          <div class="connector_x mb-3"></div>
          <q-btn
            v-if="store.uid"
            unelevated
            class="text-capitalize"
            label="Give another response"
            color="blue"
            size="sm"
            @click="vm.dialog = true"
          />
        </div>
      </div>
      <div v-else>
        <q-skeleton class="rounded-lg mb-3" type="rect" />
        <q-skeleton class="rounded-lg mb-3" type="QChip" />
        <q-skeleton height="100px" class="rounded-lg mb-3" type="QSlider" />
      </div>
      <div class="py-2">
        <q-dialog v-model="vm.dialog">
          <ResponedIssue
            :dialog="vm.dialog"
            :id="id"
            @close="vm.dialog = false"
            @fetchLog="getLog()"
          />
        </q-dialog>
        <q-dialog v-model="vm.reopen">
          <ReopenIssue
            :dialog="vm.reopen"
            :id="id"
            @close="vm.reopen = false"
            @fetchLog="getLog()"
            @refetch="manageReopen"
          />
        </q-dialog>
        <q-dialog v-model="vm.login">
          <Login
            :dialog="vm.login"
            @close="vm.login = false"
            @redirect="router.push('/create')"
          />
        </q-dialog>
        <q-dialog v-model="vm.forward">
          <forwardToWa
            :dialog="vm.forward"
            :id="id"
            @close="vm.forward = false"
            :pocket="vm.pocket"
          />
        </q-dialog>
      </div>
    </div>
    <div class="overlays" v-if="vm.uploading">
      <h5 style="font-weight: 600">uploading...</h5>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import {
  getStorage,
  ref as fbRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { inject, onMounted } from "@vue/runtime-core";
import ProgressIssue from "./ProgressIssue.vue";
import ResponedIssue from "./ResponedIssue.vue";
import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import db from "../plugins/firebase.js";
import day from "../plugins/Dayjs";
import { useRoute, useRouter } from "vue-router";
import { mainStore } from "../store/pinia";
import ReopenIssue from "./reopenIssue.vue";
import forwardToWa from "./forwardToWa.vue";
const store = mainStore();
const router = useRouter();
const route = useRoute();
let id = ref(route.params.id);
const vm = reactive({
  loading: false,
  waiting: false,
  sending: false,
  deleting: false,
  dialog: false,
  login: false,
  reopen: false,
  issue: null,
  log: [],
  file: null,
  uploading: false,
  forward: false,
  pocket: null,
  delImg: false,
});

const queryDetail = doc(db, "issue", id.value);

const fetchData = async (load) => {
  if (load) {
    vm.loading = true;
  }
  onSnapshot(queryDetail, (doc) => {
    vm.issue = doc.data();
    vm.loading = false;
  });
};

const manageReopen = async () => {
  let count = vm.issue.reopen ?? 0;
  count++;
  await updateDoc(queryDetail, {
    reopen: count,
  });

  fetchData(false);
  forwardToDiscord();
};

const forwardToDiscord = () => {
  let txt = `Luka lama terbuka kembali... si ${store.user.name} nge-reopen issue guys!, \n issue : ${vm.issue.title} \n project : ${vm.issue.project} \n nih linknya : https://tracking-issue.netlify.app/issue/${id.value} \n @everyone`;
  let body = {
    content: txt,
  };
  store.postDiscord(body);
};
const swtichStatus = async (state) => {
  if (state == "open") {
    vm.sending = true;
    await updateDoc(queryDetail, {
      status: "closed",
    });
    botWa();
    let msg = {
      activity: "closed this issue",
      icon: "mdi-check-circle-outline",
      catatan: "",
    };
    sendLog(msg);
  } else {
    vm.reopen = true;
  }
};

const botWa = () => {
  const author = `**${store.user.name}** menutup sebuah issue \n \n`;
  const title = `judul : ${vm.issue.title}\n`;
  const info = `Project : ${vm.issue.project}\nLayanan : ${vm.issue.layanan}\nKendala : ${vm.issue.kendala}\nstatus : close \n\n`;
  const link = `Check detailnya di https://tracking-issue.netlify.app/issue/${id.value}`;
  let body = {
    message: `${author}${title}${info}${link}`,
  };
  store.postWa(body);
};


const getLog = (state) => {
  vm.waiting = true;
  const q = query(
    collection(db, "issue", id.value, "logs"),
    orderBy("createdAt", "asc"),
  );
  onSnapshot(q, (qs) => {
    let data = [];
    qs.forEach((el) => {
      data.push(el.data());
    });
    vm.log = data;
    vm.waiting = false;
  });
};

const sendLog = async (msg) => {
  vm.sending = true;
  let now = day().unix();
  let log = `LOG-${now}`;

  await setDoc(doc(db, "issue", id.value, "logs", log), {
    id: log,
    activity: msg.activity,
    catatan: msg.catatan,
    icon: msg.icon,
    by: store.user.name,
    createdAt: day().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
  });
  vm.sending = false;
};

const validateCreate = () => {
  if (store.uid) {
    router.push("/create");
  } else {
    vm.login = true;
  }
};

const onUpload = (e) => {
  vm.uploading = true;
  const { files } = e.target;
  vm.file = files[0];
  const storage = getStorage();
  const storageRef = fbRef(storage, `evidence/${day().unix()}-${vm.file.name}`);

  uploadBytes(storageRef, vm.file).then((snapshot) => {
    getDownloadURL(storageRef).then((path) => {
      addEvidence(path);
    });
  });
};

const addEvidence = async (path) => {
  await updateDoc(queryDetail, {
    img: path,
  });
  vm.uploading = false;
};

const deleteImg = (path) => {
  const storage = getStorage();
  const desertRef = fbRef(storage, path);
  vm.delImg = true;
  deleteObject(desertRef)
    .then(() => {
      removeEvidence();
    })
    .catch((error) => {
      vm.delImg = false;
      console.log(error);
    });
};

const removeEvidence = async () => {
  await updateDoc(queryDetail, {
    img: "",
  });
  vm.delImg = false;
};

const onForward = () => {
  let item = Object.assign({}, vm.issue);
  let catatan = `\nProject : ${item.project}\nLayanan : ${item.layanan}\nKendala : ${item.kendala}\nstatus : ${vm.issue.status}`;
  vm.pocket = {
    catatan: catatan,
    title: item.title,
  };
  vm.forward = true;
};

const delIssue = async () => {
  vm.deleting = true;
  await deleteDoc(doc(db, "issue", id.value));
  router.push("/");
};
onMounted(() => {
  fetchData(true);
  getLog(true);
});
</script>

<style>
.input_hide {
  display: none;
}
.overlays {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.328);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.evidence-img {
  height: 300px;
}
</style>
