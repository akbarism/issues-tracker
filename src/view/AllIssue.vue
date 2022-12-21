<template>
  <div>
    <!-- <div class="row mb-2">
      <div v-for="(item, i) in tabs" :key="`tab-${i}`">
        <q-btn
          @click="changeTab(item)"
          unelevated
          class="text-capitalize mr-2 rounded-lg"
          :label="item"
          :flat="vm.state != item"
          :color="vm.state == item ? 'primary' : 'grey'"
          size="md"
        />
      </div>
    </div> -->
    <div class="mb-3">
      <q-btn
        size="sm"
        color="primary"
        unelevated
        class="text-capitalize"
        style="height: max-content"
        :label="vm.label"
      >
        <q-menu v-if="project.length" :offset="[0, 5]">
          <q-list dense style="min-width: 100px">
            <q-item
              clickable
              v-close-popup
              v-for="(item, i) in project"
              :key="`proj-${i}`"
              @click="selectProject(item)"
            >
              <q-item-section>{{ item }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
    <div v-if="vm.project">
      <div class="row mb-3">
        <template v-if="vm.project == 'Teman Bakat'">
          <div class="col-3 small_txt text-weight-bold">Tipe Layanan</div>
          <div class="col-9 mb-3">
            <q-select
              outlined
              v-model="vm.tipe_layanan"
              :options="tipe_layanan"
              color="orange"
              class="bg-white"
              dense
            />
          </div>
          <template v-if="vm.tipe_layanan == 'Psikotes'">
            <div class="col-3 small_txt text-weight-bold">Layanan</div>
            <div class="col-9 mb-3">
              <q-select
                outlined
                v-model="vm.layanan"
                :options="vm.psikotes"
                color="orange"
                class="bg-white"
                dense
              />
            </div>
          </template>
          <template v-if="vm.tipe_layanan == 'Konsultasi'">
            <div class="col-3 small_txt text-weight-bold">Layanan</div>
            <div class="col-9 mb-3">
              <q-select
                outlined
                v-model="vm.layanan"
                :options="vm.psikotes"
                color="orange"
                class="bg-white"
                dense
              />
            </div>
          </template>
        </template>

        <div class="col-3 small_txt text-weight-bold">Kendala</div>
        <div class="col-9">
          <q-select
            outlined
            v-model="vm.kendala"
            :options="kendala"
            color="orange"
            class="bg-white"
            dense
          />
        </div>
      </div>
      <div class="row justify-end mb-3">
        <q-btn
          size="sm"
          color="primary"
          unelevated
          class="text-capitalize"
          style="height: max-content"
          icon="mdi-filter"
          label="Filter"
          @click="fetchData"
        >
        </q-btn>
      </div>
    </div>
    <!-- <div class="row mb-2">
      <div v-for="(item, i) in tabs" :key="`tab-${i}`">
        <q-btn
          @click="changeTab(item)"
          unelevated
          class="text-capitalize mr-2 rounded-lg"
          :label="item"
          :flat="vm.state != item"
          :color="vm.state == item ? 'primary' : 'grey'"
          size="md"
        />
      </div>
    </div> -->
    <div v-if="!vm.loading">
      <div v-if="store.issue.length">
        <q-card
          class="rounded-lg mb-3"
          v-for="(item, i) in store.issue"
          :key="`issue-${i}`"
          flat
          bordered
        >
          <ItemIssue :item="item" />
        </q-card>
      </div>
    </div>
    <div v-else>
      <q-skeleton
        height="80px"
        v-for="i in 3"
        :key="`loading${i}`"
        class="rounded-lg mb-3"
        type="QSlider"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { mainStore } from "../store/pinia";
import { collection, orderBy, query, where, getDocs } from "firebase/firestore";
import { onMounted } from "@vue/runtime-core";
import db from "../plugins/firebase";
import ItemIssue from "../components/ItemIssue.vue";

const store = mainStore();
const tabs = ["open", "closed", "all issue"];
const vm = reactive({
  loading: false,
  state: "",
  project: "",
  label: "pilih project",
  psikotes: [],
  konsultasi: [],
  tipe_layanan: "",
  layanan: "",
  kendala: "",
});
const tipe_layanan = ["Psikotes", "Konsultasi", "Layanan"];
const kendala = ["Report", "Force Close", "Notifikasi", "Login", "Lainya"];
const project = ref([]);
const changeTab = (item) => {
  vm.state = item;
  fetchData();
};
const fetchProjcect = async () => {
  const res = await getDocs(collection(db, "project"));
  res.forEach((el) => project.value.push(el.data().name));
  project.value.push("All Project");
};
const selectProject = (item) => {
  vm.label = item == "All Project" ? "Pilih Project" : `Project : ${item}`;
  vm.project = item != "All Project" ? item : "";
  fetchData();
};
const fetchData = async () => {
  vm.loading = true;
  let q = null;
  let conditions = [];
  if (vm.project !== "") conditions.push(where("project", "==", vm.project));
  if (vm.tipe_layanan !== "")
    conditions.push(where("tipe_layanan", "==", vm.tipe_layanan));
  if (vm.layanan !== "") conditions.push(where("layanan", "==", vm.layanan));
  if (vm.kendala !== "") conditions.push(where("kendala", "==", vm.kendala));
  if (vm.state !== "") conditions.push(where("status", "==", vm.state));
  q = query(
    collection(db, "issue"),
    orderBy("createdAt", "desc"),
    ...conditions,
  );

  await store.getIssue(q);
  vm.loading = false;
};

const getPsikotes = () => {
  store
    .getApi("admin/psikotes-setting")
    .then((res) =>
      res.data.data.forEach((el) => vm.psikotes.push(el.nama_psikotes)),
    );
};

const getKonsultasi = () => {
  store
    .getApi("admin/konsultasi")
    .then((res) =>
      res.data.data.forEach((el) => vm.konsultasi.push(el.nama_konsultasi)),
    );
};

onMounted(() => {
  getPsikotes();
  getKonsultasi();
  fetchData();
  fetchProjcect();
});
</script>

<style></style>
