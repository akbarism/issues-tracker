import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("./view/Home.vue"),
    children: [
      {
        path: "/",
        name: "Dashboard",
        component: () => import("./view/Dashboard.vue"),
      },
      {
        path: "/create",
        name: "newIssue",
        component: () => import("./view/CreateIssue.vue"),
      },
      {
        path: "/issue/:id",
        name: "issueDetail",
        component: () => import("./view/DetailIssue.vue"),
      },
      {
        path: "/register",
        name: "register",
        component: () => import("./view/auth/Register.vue"),
      },
      {
        path: "/all-issue",
        name: "AllIssue",
        component: () => import("./view/AllIssue.vue"),
      },
      // dev router
      {
        path: "/users",
        name: "listUser",
        component: () => import("./view/developer/listUser.vue"),
      },
      {
        path: "/Projects",
        name: "listProject",
        component: () => import("./view/developer/listProject.vue"),
      },
      {
        path: "/daftar-kendala",
        name: "kendala",
        component: () => import("./view/developer/listKendala.vue"),
      },
      {
        path: "/responses-type",
        name: "responses-type",
        component: () => import("./view/developer/typeResponse.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
