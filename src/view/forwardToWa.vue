<template>
  <q-card flat class="rounded-lg response_dialog" style="position: relative">
    <q-card-section>
      <div class="text-h6">Kirim ke Grup WA</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="mb-3" v-if="pocket">
        <q-input v-model="pocket.catatan" filled type="textarea" />
      </div>
    </q-card-section>
    <q-card-actions align="right" v-if="pocket">
      <ShareNetwork
        network="WhatsApp"
        :title="`${pocket?.title}\n`"
        :url="`https://tracking-issue.netlify.app/issue/${id}`"
        :description="pocket.catatan"
        @open="$emit(close)"
        style="text-decoration: none"
      >
        <q-btn
          unelevated
          class="text-capitalize"
          label="submit"
          color="blue"
          size="md"
        />
      </ShareNetwork>
    </q-card-actions>
    <backdrop v-if="vm.sending" />
  </q-card>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import { defineComponent } from "vue";
import Backdrop from "../components/Backdrop.vue";
import { mainStore } from "../store/pinia";
const store = mainStore();
const props = defineProps({
  dialog: Boolean,
  pocket: null,
  id: null,
});
defineComponent({
  name: "forwardToWa",
});
const vm = reactive({
  sending: false,
});
const emit = defineEmits(["close", "fetchLog", "refetch"]);
</script>

<style></style>
