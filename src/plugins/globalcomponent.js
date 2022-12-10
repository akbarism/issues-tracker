// import Vue from "vue";

import Login from "../view/auth/Login.vue";
import Navbar from "../components/Navbar.vue";
export const globalcomponent = (app) => {
  app.component("Login", Login);
  app.component("Navbar", Navbar);
};
