<template>
  <q-card flat class="rounded-lg response_dialog" style="position: relative">
    <q-card-section>
      <div class="text-h6">Reopen an issue</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="mb-3">
        <p class="q-mb-none text-weight-medium">Berikan Alasan</p>
        <q-editor v-model="form.catatan" min-height="5rem" />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        @click="sendLog"
        unelevated
        class="text-capitalize"
        label="reopen issue"
        color="blue"
        size="md"
      />
    </q-card-actions>
    <backdrop v-if="vm.sending" />
  </q-card>
</template>

<script setup>
import { updateDoc, setDoc, doc } from "@firebase/firestore";
import { reactive } from "@vue/reactivity";
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
});
const emit = defineEmits(["close", "fetchLog", "refetch"]);

const form = reactive({
  catatan: "",
});

const sendLog = async () => {
  vm.sending = true;
  const queryDetail = doc(db, "issue", props.id);
  await updateDoc(queryDetail, {
    status: "open",
  });
  let now = day().unix();
  let log = `LOG-${now}`;

  await setDoc(doc(db, "issue", props.id, "logs", log), {
    id: log,
    activity: "reopened this issue",
    catatan: form.catatan,
    icon: "mdi-sync-circle",
    by: store.user.name,
    createdAt: day().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
  });
  emit("fetchLog");
  emit("refetch");
  emit("close");
  vm.sending = false;
};


</script>

<style></style>
