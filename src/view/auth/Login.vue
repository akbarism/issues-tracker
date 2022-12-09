<template>
  <q-card
    class="rounded-lg"
    flat
    bordered
    style="position: relative; width: 350px"
  >
    <q-card-section>
      <div class="text-h6">Tell me who you are</div>
    </q-card-section>
    <Backdrop v-if="loading" />
    <q-card-section>
      <div class="mb-3">
        <q-input
          outlined
          dense
          v-model="form.email"
          @keyup.enter="login"
          color="orange"
          class="rounded-lg"
        />
      </div>
      <div class="row justify-end">
        <q-btn
          @click="login"
          unelevated
          class="text-capitalize"
          label="login"
          color="blue"
          size="md"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import day from "../../plugins/Dayjs";
import db from "../../plugins/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Backdrop from "../../components/Backdrop.vue";
import { doc, setDoc } from "@firebase/firestore";
import { useQuasar } from "quasar";
import { mainStore } from "../../store/pinia";
const store = mainStore();
const $q = useQuasar();
const form = reactive({
  email: "",
  password: "",
});
const emit = defineEmits(["close", "redirect"]);
const loading = ref(false);
const notify = (msg) => {
  $q.notify({
    message: msg.msg,
    type: msg.type,
  });
};
const login = () => {
  loading.value = true;
  const auth = getAuth();
  let email = `${form.email}@gmail.com`;
  signInWithEmailAndPassword(auth, email, "Tes123tes@")
    .then((userCredential) => {
      const user = userCredential.user;
      emit("close");
      emit("user");
      emit("redirect");
      localStorage.setItem("uid", user.uid);
      notify({ msg: "Login Berhasil!", type: "positive" });
      store.checkAuth();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      notify({ msg: errorMessage, type: "negative" });
    });
};
</script>

<style></style>
