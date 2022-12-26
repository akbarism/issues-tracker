<template>
  <q-card class="pa-2 rounded-lg" v-if="vm.chart">
    <div class="px-3">
      <p style="font-size: 18px" class="text-weight-bold q-mb-none">All Issue</p>
    </div>
    <apexchart
      type="area"
      height="300"
      :options="vm.chart.option"
      :series="vm.chart.series"
    ></apexchart>
  </q-card>
</template>

<script setup>
import { collection, orderBy, query, getDocs } from "@firebase/firestore";
import { onMounted, reactive } from "vue";
import db from "../../plugins/firebase";
import { mainStore } from "../../store/pinia";
import groupBy from "lodash.groupby";
import day from "../../plugins/Dayjs";

const store = mainStore();

const vm = reactive({
  chart: null,
});
const getIssue = async () => {
  const q = query(collection(db, "issue"), orderBy("createdAt", "desc"));

  const qs = await getDocs(q);
  let res = [];
  qs.forEach((el) => {
    res.push(el.data());
  });
  let grouped = groupBy(res, "month");
  let category = [];
  let series = [];
  for (let i in grouped) {
    let format = day(`01-${i}`, "DD-MM-YYYY").format("MMM");
    category.push(format);
    series.push(grouped[i].length);
  }

  makeChart({ category: category, series: series });
};

const makeChart = (raw) => {
  let conf = {
    series: [
      {
        name: "issue",
        data: raw.series,
      },
    ],
    option: {
      chart: {
        height: 300,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: raw.category,
      },
      grid: {
        show: false,
      },
      tooltip: {
        x: {
          format: "MMMM",
        },
      },
    },
  };

  vm.chart = conf;
};
onMounted(() => {
  getIssue();
});
</script>
