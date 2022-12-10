<template>
  <div class="row justify-center">
    <div class="break_point q-py-md">
      <Navbar />
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
        </div>
      </div>
      <div v-if="!vm.loading">
        <div v-if="vm.issue">
          <div class="mb-2">
            <p class="text-weight-bold q-mb-none" style="font-size: 18px">
              {{ vm.issue.title }}
            </p>
            <div class="row items-center justify-end">
              <span class="text-grey text-weight-regular mr-2"
                >#{{ vm.issue.id }}</span
              >
              <q-btn
                round
                unelevated
                flat
                size="sm"
                color="primary"
                icon="mdi-content-copy"
              />
            </div>
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
            <p class="xsmall_txt text-grey q-mb-none">
              <span class="text-weight-bold">{{ vm.issue.by }}</span> created
              this issue {{ day(vm.issue.createdAt).fromNow() }}
            </p>
          </div>
          <q-card class="rounded-lg" flat bordered style="position: relative">
            <q-card-section>
              <p v-html="vm.issue.deskripsi"></p>
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
            @refetch="fetchData(false)"
          />
        </q-dialog>
        <q-dialog v-model="vm.login">
          <Login
            :dialog="vm.login"
            @close="vm.login = false"
            @redirect="router.push('/create')"
          />
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
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
} from "firebase/firestore";
import db from "../plugins/firebase.js";
import day from "../plugins/Dayjs";
import { useRoute, useRouter } from "vue-router";
import { mainStore } from "../store/pinia";
import ReopenIssue from "./reopenIssue.vue";
const store = mainStore();
const router = useRouter();
const route = useRoute();
let id = ref(route.params.id);
const vm = reactive({
  loading: false,
  waiting: false,
  sending: false,
  dialog: false,
  login: false,
  reopen: false,
  issue: null,
  log: [],
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

const swtichStatus = async (state) => {
  if (state == "open") {
    vm.sending = true;
    await updateDoc(queryDetail, {
      status: "closed",
    });
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

onMounted(() => {
  fetchData(true);
  getLog(true);
});
</script>

<style></style>
