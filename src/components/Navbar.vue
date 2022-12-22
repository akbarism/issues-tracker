<template>
  <div class="py-3 row justify-between items-center">
    <div v-if="store">
      <div class="row items-center" v-if="store.user">
        <q-avatar>
          <img :src="store.user.ava ? store.user.ava : ava" />
        </q-avatar>
        <div>
          <p class="small_txt text-weight-medium q-mb-none ml-2">
            {{ store.user.name }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="store">
      <q-btn
        size="sm"
        unelevated
        icon="mdi-dots-vertical"
        round
        style="height: max-content"
      >
        <q-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup v-if="store.user">
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              v-if="store.user && store.user.role == 1"
              @click="$emit('devOn')"
            >
              <q-item-section>Developer Mode</q-item-section>
            </q-item>
            <q-separator />
            <q-item
              clickable
              v-if="route.path != '/'"
              v-close-popup
              @click="toHome()"
            >
              <q-item-section>Home</q-item-section>
            </q-item>
            <q-item clickable @click="logout" v-close-popup v-if="store.user">
              <q-item-section>Logout</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="vm.dialog = true"
              v-close-popup
              v-if="!store.user"
            >
              <q-item-section>Login</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-dialog v-model="vm.dialog">
        <Login
          :dialog="vm.dialog"
          @close="vm.dialog = false"
          @redirect="() => {}"
        />
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { mainStore } from "../store/pinia";
import ava from "../assets/img/ava1.png";
import { getAuth, signOut } from "firebase/auth";
import { reactive } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
const store = mainStore();
const auth = getAuth();
const route = useRoute();
const router = useRouter();
const vm = reactive({
  dialog: false,
});
const toHome = () => {
  router.push("/");
};

const logout = async () => {
  await signOut(auth);
  store.checkAuth();
};
</script>

<style></style>
