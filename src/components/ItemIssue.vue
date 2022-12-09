<template>
  <q-card-section class="row justify-between no-wrap">
    <div>
      <p class="text-weight-bold q-mb-none title_" @click="toDetail(item.id)">
        {{ item.title }}
      </p>
      <p class="xsmall_txt q-mb-none text-grey mr-1">
        #{{ item.id }} on
        {{ day(item.created_at).format("DD MMMM YYYY") }}
      </p>
    </div>
    <div class="column items-end">
      <q-btn
        :color="item.status == 'open' ? 'deep-orange' : 'deep-purple-9'"
        class="text-capitalize px-2"
        unelevated
        size="sm"
        rounded
        style="height: max-content"
      >
        <div class="row no-wrap">
          <q-icon
            class="mr-1"
            :name="`mdi-${
              item.status == 'open'
                ? 'checkbox-blank-circle-outline'
                : 'check-circle-outline'
            }`"
          ></q-icon>
          {{ item.status }}
        </div>
      </q-btn>
    </div>
  </q-card-section>
</template>

<script setup>
import { useRouter } from "vue-router";
import day from "../plugins/Dayjs";
const router = useRouter();
const toDetail = (id) => {
  router.push(`/issue/${id}`);
};
defineProps({
  item: null,
});
</script>

<style scoped>
.title_:hover {
  color: #ff9800;
  cursor: pointer;
  transition: 0.2s all;
}
</style>
