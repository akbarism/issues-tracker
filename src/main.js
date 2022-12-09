// FILE: main.js

import { createApp } from "vue";
import { Quasar, Notify } from "quasar";
import { createPinia } from "pinia";

// Import icon libraries
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/mdi-v6/mdi-v6.css";
import "../src/assets/css/style.css";
import { globalcomponent } from "./plugins/globalcomponent.js";
// Import Quasar css
import "quasar/src/css/index.sass";
import router from "./router";
// import db from "./plugins/firebase";
import App from "./App.vue";
const myApp = createApp(App);
myApp.use(createPinia());
globalcomponent(myApp);

myApp
  .use(Quasar, {
    plugins: { Notify }, // import Quasar plugins and add here
  })
  .use(router);

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount("#app");
