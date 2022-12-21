<template>
  <div class="row justify-center">
    <div class="break_point">
      <Navbar @devOn="vm.dev = true" />
      <router-view></router-view>
      <Footer @create="vm.dialog = true" />
      <div style="height: 65px">
        <q-dialog v-model="vm.dialog">
          <Login
            :dialog="vm.dialog"
            @close="vm.dialog = false"
            @redirect="router.push('/create')"
          />
        </q-dialog>
        <q-dialog v-model="vm.dev">
          <devMenu :dialog="vm.dev" @close="vm.dev = false" />
        </q-dialog>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { reactive } from "vue";
import Footer from "../components/Footer.vue";
import devMenu from "../components/devMenu.vue";
const router = useRouter();
const vm = reactive({
  dialog: false,
  dev: false,
});
</script>
