<template>
  <q-card flat class="mb-2 rounded-lg">
    <q-card-section>
      <div class="row justify-between mb-3">
        <p class="text-weight-bold ml-1 q-mb-none">
          Issue's <span class="text-primary">Tracker</span>
        </p>
        <q-btn
          size="sm"
          color="primary"
          unelevated
          class="text-capitalize"
          style="height: max-content"
          @click="$emit('create')"
        >
          New Issue
        </q-btn>
      </div>
      <div class="row" v-if="store.count">
        <div class="col-6 pr-2">
          <div class="cards open px-5 py-3">
            <div class="temp-text">
              <div>
                <p
                  class="q-mb-none text-weight-bold text-right"
                  style="font-size: 30px"
                >
                  {{ store.count.open }}
                </p>
                <p class="q-mb-none small_txt text-weight-medium">Open Issue</p>
              </div>
            </div>
            <div class="roll pos-1"></div>
            <div class="roll pos-2"></div>
            <div class="roll pos-3"></div>
          </div>
        </div>
        <div class="col-6 pl-2">
          <div class="cards closed px-5 py-3">
            <div class="temp-text">
              <div>
                <p
                  class="q-mb-none text-weight-bold text-right"
                  style="font-size: 30px"
                >
                  {{ store.count.close }}
                </p>
                <p class="q-mb-none small_txt text-weight-medium">
                  Closed Issue
                </p>
              </div>
            </div>
            <div class="roll pos-1"></div>
            <div class="roll pos-2"></div>
            <div class="roll pos-3"></div>
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-6 pr-2">
          <q-skeleton height="60px" class="rounded-lg mb-3" type="QSlider" />
        </div>
        <div class="col-6 pl-2">
          <q-skeleton height="60px" class="rounded-lg mb-3" type="QSlider" />
        </div>
      </div>
      <div class="pt-3">
        Status Bot Whatsapp :
        <span class="text-weight-bold">{{
          status_bot ? "Online" : "Offline"
        }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { mainStore } from "../store/pinia";
const store = mainStore();
const emit = defineEmits(["create"]);
const props = defineProps({
  status_bot: null,
});

onMounted(() => {
  store.counterIssue();
});
</script>

<style scoped>
.cards {
  position: relative;
  overflow: hidden;
  height: 100px;
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(
    278.29deg,
    #fbb2b4 30.05%,
    rgba(255, 143, 178, 0) 133.19%
  );
}
.open {
  background: linear-gradient(
    278.29deg,
    #fbb2b4 30.05%,
    rgba(255, 143, 178, 0) 133.19%
  );
}
.closed {
  background: linear-gradient(
    278.29deg,
    #ab84c8 30.05%,
    rgba(241, 201, 236, 0) 133.19%
  );
}
.roll {
  position: absolute;
  width: 80px;
  height: 80px;
  background: #fff;
  opacity: 0.2;
  border-radius: 50%;
  bottom: -20px;
  left: -20px;
}

.pos-1 {
  bottom: -20px;
  left: -20px;
}
.pos-2 {
  bottom: 0;
  left: 10px;
}
.pos-3 {
  bottom: 10px;
  left: 40px;
}
.temp-text {
  display: flex;
  justify-content: end;
  width: 100%;
  position: relative;
  z-index: 2;
}
</style>
