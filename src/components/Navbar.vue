<template>
  <div class="py-3 row justify-between items-center">
    <div class="row items-center">
      <q-avatar>
        <img :src="ava" />
      </q-avatar>
      <div v-if="store">
        <p
          class="small_txt text-weight-medium q-mb-none ml-2"
          v-if="store.user"
        >
          {{ store.user.name }}
        </p>
      </div>
    </div>
    <q-btn
      size="sm"
      unelevated
      icon="mdi-dots-vertical"
      round
      style="height: max-content"
      @click="logout"
    >
    </q-btn>
  </div>
</template>

<script setup>
import { mainStore } from "../store/pinia";
import ava from "../assets/img/ava1.png";
import { getAuth, signOut } from "firebase/auth";

const store = mainStore();
const auth = getAuth();
const logout = () => {
  signOut(auth);
};
</script>

<style></style>
