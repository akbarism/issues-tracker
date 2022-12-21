<template>
  <div class="footer-app">
    <div class="inner-foot row">
      <div
        class="col-3 pa-3 cursor-pointer"
        v-for="(menu, i) in menus"
        :key="`menu-${i}`"
        :style="`background:${menu.path == route.path ? '#E3F2FD' : ''}`"
        @click="goTo(menu.path)"
      >
        <div class="row justify-center">
          <q-icon
            :name="menu.icon"
            size="23px"
            :color="menu.path == route.path ? 'primary' : ''"
          ></q-icon>
        </div>
        <p
          :class="`q-mb-none text-center xsmall_txt ${
            menu.path == route.path ? 'text-primary text-weight-medium' : ''
          }`"
        >
          {{ menu.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mainStore } from "../store/pinia";
const router = useRouter();
const route = useRoute();
const store = mainStore();
const menus = ref([
  {
    title: "Home",
    icon: "weekend",
    path: "/",
  },
  {
    title: "All Issue",
    icon: "web_stories",
    path: "/all-issue",
  },
  {
    title: "Add Issue",
    icon: "mdi-sticker-plus",
    path: "/create",
  },
  {
    title: "Statistic",
    icon: "analytics",
    path: "/statistic",
  },
]);

const emit = defineEmits(["create"]);

const goTo = (path) => {
  if (path == "/create") {
    if (store.uid) {
      router.push(path);
    } else {
      emit("create");
    }
  } else {
    router.push(path);
  }
};
defineComponent({
  name: "FooterApp",
});
</script>

<style></style>
