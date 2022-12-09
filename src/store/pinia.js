import { defineStore } from "pinia";
import {
  collection,
  setDoc,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import db from "../plugins/firebase";

export const mainStore = defineStore("main", {
  state: () => ({
    user: null,
    uid: null,
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
  },
});
