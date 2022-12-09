import { defineStore } from "pinia";
import {
  collection,
  setDoc,
  getDocs,
  orderBy,
  doc,
  getDoc,
  query,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import db from "../plugins/firebase";

export const mainStore = defineStore("main", {
  state: () => ({
    user: null,
    uid: null,
    count: null,
    issue: [],
  }),

  actions: {
    checkAuth() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.uid = user.uid;
          this.getUser();
        }
      });
    },

    async getUser() {
      const queryDetail = doc(db, "user", this.uid);
      const res = await getDoc(queryDetail);
      this.user = res.data();
    },
    async counterIssue() {
      let q = collection(db, "issue");
      const res = await getDocs(q);
      let data = [];
      res.forEach((el) => {
        data.push(el.data());
      });
      let open = data.filter((el) => el.status == "open").length;
      let close = data.filter((el) => el.status == "closed").length;
      this.count = {
        open: open,
        close: close,
        all: data.length,
      };
    },

    async getIssue(q) {
      const res = await getDocs(q);
      let data = [];
      res.forEach((el) => {
        data.push(el.data());
      });
      this.issue = data;
    },
  },
});
