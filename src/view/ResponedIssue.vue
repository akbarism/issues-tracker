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
      <div class="mb-3">
        <p class="q-mb-none text-weight-medium">Catatan</p>
        <q-editor v-model="form.catatan" min-height="5rem" />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        v-if="form.type"
        @click="sendLog"
        unelevated
        class="text-capitalize"
        label="Submit"
        color="blue"
        size="md"
      />
    </q-card-actions>
    <backdrop v-if="vm.sending" />
  </q-card>
</template>

<script setup>
import { setDoc, doc, getDocs, collection } from "@firebase/firestore";
import { reactive, onMounted } from "vue";
import Backdrop from "../components/Backdrop.vue";
import day from "../plugins/Dayjs";
import db from "../plugins/firebase";
import { mainStore } from "../store/pinia";
const store = mainStore();
const props = defineProps({
  dialog: Boolean,
  id: null,
});
const vm = reactive({
  sending: false,
  listAct: [],
});
const emit = defineEmits(["close", "fetchLog"]);

const listAct = [
  {
    label: "Comment",
    value: "added a comment on this issue",
    icon: "mdi-comment-outline",
  },
  {
    label: "Tested",
    value: "has tested this issue",
    icon: "mdi-test-tube",
  },
  {
    label: "Fixed",
    value: "has fixed this issue",
    icon: "mdi-auto-fix",
  },
];

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
});

const sendLog = async (msg) => {
  vm.sending = true;
  let now = day().unix();
  let log = `LOG-${now}`;

  await setDoc(doc(db, "issue", props.id, "logs", log), {
    id: log,
    activity: form.type?.value,
    catatan: form.catatan,
    icon: form.type?.icon,
    by: store.user.name,
    createdAt: day().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
  });
  emit("fetchLog");
  emit("close");
  vm.sending = false;
};

onMounted(() => {
  fetchData();
});
</script>

<style></style>
