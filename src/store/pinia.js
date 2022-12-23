import { defineStore } from "pinia";
import axios from "axios";
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
    webhook:
      "https://discordapp.com/api/webhooks/1055436509504884807/FXUBeQT4rN3XdQdrJ7dHiaoOA_c2hu00b0-V4bPPkwGzZt5eQpduGiZwfacSxPftjEXk",
  }),

  actions: {
    checkAuth() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.uid = user.uid;
          this.getUser();
        } else {
          this.uid = null;
          this.user = null;
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

    postDiscord(body) {
      axios.post(this.webhook, body);
    },
    postWa(body) {
      axios.post("https://simple-discord-bot-jade.vercel.app/msg", body);
    },

    getApi(path) {
      return new Promise((resolve, reject) => {
        const config = {
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZGV2LW9ubGluZXRlc3QuZ2FtaWZpbmRvLmNvbVwvYXBpXC9hZG1pblwvbG9naW4iLCJpYXQiOjE2NzE1OTMzOTEsImV4cCI6MTcwMzEyOTM5MSwibmJmIjoxNjcxNTkzMzkxLCJqdGkiOiJoYXdYb1pYNWllVE53R3FLIiwic3ViIjoxMSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.1uf4fYsFQzGe3j-xMTIhWzaHw_iDOHlgSucJ_q8vplE`,
          },
        };
        this.isErr = false;
        axios
          .get(`https://dev-onlinetest.gamifindo.com/api/${path}`, config)
          .then((res) => {
            resolve(res.data ?? res);
          })
          .catch((err) => {
            if (err.response.data) {
              reject(err.response.data);
            } else {
              reject(err);
            }
          });
      });
    },
  },
});
