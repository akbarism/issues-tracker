<template>
  <q-card
    class="rounded-lg pa-5"
    flat
    bordered
    style="position: relative; width: 350px"
  >
    <div
      v-for="(item, i) in menu"
      :key="`meni-${i}`"
      :style="`background:${item.path == route.path ? '#E3F2FD' : ''}`"
      class="list-menu"
    >
      <router-link :to="item.path" class="router-link">
        <div class="pa-3 row">
          <q-icon
            :name="item.icon"
            size="23px"
            :color="item.path == route.path ? 'primary' : 'black'"
          ></q-icon>
          <p
            :class="`q-mb-none small_txt ml-3 ${
              item.path == route.path
                ? 'text-primary text-weight-medium'
                : 'text-black'
            }`"
          >
            {{ item.title }}
          </p>
        </div>
      </router-link>
    </div>
  </q-card>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const menu = [
  {
    title: "User",
    path: "/users",
    icon: "person_pin",
  },
  {
    title: "Project",
    path: "/Projects",
    icon: "phonelink",
  },
  {
    title: "Kendala",
    path: "/daftar-kendala",
    icon: "emoji_nature",
  },
  {
    title: "Response",
    path: "/responses-type",
    icon: "campaign",
  },
];
</script>

<style>
.router-link {
  text-decoration: none;
}
.list-menu {
  border-radius: 5px !important;
}
.list-menu:hover {
  background: #e3f2fd;
}
</style>
