<template>
  <div>
    <q-card class="pa-3 rounded-lg">
      <div v-if="!vm.loading">
        <div class="row">
          <q-icon
            name="mdi-whatsapp"
            color="green"
            size="lg"
            class="mr-3"
          ></q-icon>
          <div>
            <p class="q-mb-none small_txt text-grey">status</p>
            <p :class="vm.wa_bot">{{ vm.wa_bot }}</p>
            <p v-if="vm.info" class="q-mb-none">
              at
              {{
                vm.wa_bot == "connected"
                  ? day(vm.info.connected_at).format("dddd, DD MMMM YYYY")
                  : day(vm.info.disconnected_at).format("dddd, DD MMMM YYYY")
              }}
            </p>
          </div>
        </div>
        <div v-if="vm.base64QR">
          <p class="text-center q-mb-none mt-5 text-weight-bold text-grey">
            Scan to connect
          </p>
          <div class="row justify-center">
            <img :src="vm.base64QR" alt="qr" />
          </div>
        </div>
      </div>
      <div v-else class="row items-center">
        <q-circular-progress
          indeterminate
          rounded
          size="50px"
          color="blue"
          class="q-ma-md"
        />
        <p class="q-mb-none text-weight-bold">Loading...</p>
      </div>
    </q-card>
    <div v-if="vm.groups.length" class="mt-5">
      <q-card
        class="pa-3 rounded-lg mb-3"
        v-for="(item, i) in vm.groups"
        :key="i"
      >
        <p class="q-mb-none text-weight-bold">{{ item.name }}</p>
        <p class="q-mb-none small_txt text-grey">{{ item.id }}</p>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { mainStore } from "../../store/pinia";
import day from "../../plugins/Dayjs";
import QRCode from "qrcode";

const store = mainStore();

const vm = reactive({
  loading: true,
  wa_bot: "disconnect",
  quota: null,
  info: null,
  base64QR: null,
  groups: [],
});

const getDevice = () => {
  //   vm.loading = true;
  store
    .getInfoDevice()
    .then((res) => {
      let bot = res.data;
      vm.wa_bot = bot.status == "connected" ? bot.status : "disconnect";
      if (bot) {
        vm.info = bot;
        if (bot.status !== "connected") {
          generateQr();
        } else {
          getGroup();
        }
      }
      vm.loading = false;
    })
    .catch((err) => {
      vm.loading = false;
    });
};

const generateQr = () => {
  store.getQr().then((res) => {
    if (res) {
      QRCode.toDataURL(res.qr_code).then((url) => {
        vm.base64QR = url;
        reGenerate();
      });
    }
  });
};

const getGroup = () => {
  store.listGroup().then((res) => {
    if (res.data) {
      vm.groups = res.data;
    }
  });
};

const reGenerate = () => {
  let detik = 0;
  let checking = null;
  checking = setInterval(() => {
    detik++;
    if (detik % 2 == 0) {
      store.getInfoDevice().then((res) => {
        if (res.data.status == "connected") {
          clearInterval(checking);
          vm.wa_bot = res.data.status;
          vm.base64QR = null;
        }
      });
    }
  }, 1000);
};

onMounted(() => {
  getDevice();
});
</script>

<style scoped>
.connected {
  color: #4caf50;
  font-weight: 600;
  font-size: 20px;
  line-height: 10px;
  margin-bottom: 5px !important;
}
.disconnect {
  color: #f44336;
  font-weight: 600;
  font-size: 20px;
  line-height: 10px;
  margin-bottom: 5px !important;
}
</style>
