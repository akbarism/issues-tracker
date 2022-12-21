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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
