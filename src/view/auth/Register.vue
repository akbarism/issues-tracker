<template>
  <div class="row justify-center">
    <div class="break_point q-py-md">
      <div class="row items-center mb-3">
        <q-icon name="mdi-plus-circle"></q-icon>
        <p class="text-weight-bold ml-1 q-mb-none">Registering User</p>
      </div>
      <q-card class="rounded-lg" flat bordered style="position: relative">
        <Backdrop v-if="loading" />
        <q-card-section>
          <div class="mb-3">
            <p class="q-mb-none text-weight-medium">Display Name</p>
            <q-input
              outlined
              dense
              v-model="form.name"
              color="orange"
              class="rounded-lg"
            />
          </div>
          <div class="mb-3">
            <p class="q-mb-none text-weight-medium">username</p>
            <q-input
              outlined
              dense
              v-model="form.email"
              color="orange"
              class="rounded-lg"
            />
          </div>
          <div class="mb-3">
            <p class="q-mb-none text-weight-medium">password</p>
            <q-input
              outlined
              dense
              v-model="form.password"
              color="orange"
              class="rounded-lg"
            />
          </div>
          <div class="mb-3">
            <p class="q-mb-none text-weight-medium">role</p>
            <div class="row">
              <div v-for="(item, i) in role" :key="i">
                <q-btn
                  @click="form.role = item.id"
                  unelevated
                  class="text-capitalize mr-2"
                  :label="item.name"
                  color="blue"
                  :outline="form.role == item.id ? false : true"
                  size="md"
                />
              </div>
            </div>
          </div>
          <div class="row justify-end">
            <q-btn
              @click="regis"
              unelevated
              class="text-capitalize"
              label="Register"
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
import day from "../../plugins/Dayjs";
import db from "../../plugins/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Backdrop from "../../components/Backdrop.vue";
import { doc, setDoc } from "@firebase/firestore";
import { useQuasar } from "quasar";
const $q = useQuasar();
const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "",
});
const loading = ref(false);
const role = [
  {
    name: "Stake Holder",
    id: 2,
  },
  {
    name: "Developer",
    id: 1,
  },
  {
    name: "QA",
    id: 3,
  },
];
const notify = (msg) => {
  $q.notify({
    message: msg.msg,
    type: msg.type,
  });
};
const regis = () => {
  loading.value = true;
  const auth = getAuth();
  let email = `${form.email}@gmail.com`;
  createUserWithEmailAndPassword(auth, email, form.password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user.uid);
      localStorage.setItem("uid", user.uid);
      toDb(user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      notify({ msg: errorMessage, type: "negative" });
    });
};

const toDb = async (id) => {
  await setDoc(doc(db, "user", id), {
    id: id,
    name: form.name,
    email: form.email,
    password: form.password,
    createdAt: day().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
    ava: "",
    role: form.role,
  });

  for (let i in form) {
    form[i] = "";
  }
  notify({ msg: "Register success", type: "positive" });
  loading.value = false;
};
</script>

<style></style>
