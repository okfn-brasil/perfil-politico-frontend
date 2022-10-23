<template>
  <div
    class="c-card-info w-full bg-primary-base rounded-lg border border-neutral-light"
  >
    <button
      class="c-card-info__title w-full flex flex-wrap justify-between text-center text-white bg-primary-dark rounded-t-lg py-5 px-5 text-base font-semibold"
      :class="!isOpenAnalisys ? 'rounded-b-xl' : 'rounded-none'"
      v-on:click="isOpenAnalisys = !isOpenAnalisys"
    >
      <span>Filtros por análises</span>
      <span>
        <svg
          v-if="isOpenAnalisys"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7"
          ></path>
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </span>
    </button>
    <div :class="isOpenAnalisys ? 'd-block' : 'hidden'">
      <div class="c-card-info__content p-5 md:grid grid-cols-3 gap-4">
        <div class="flex flex-col justify-center pb-8 md:pb-0">
          <h2 class="text-secondary-base text-3xl font-bold mb-2 text-left break-words">
            Análises sobre as candidaturas
          </h2>
          <p class="text-white">
            Ao clicar nas perguntas, você verá apenas as candidaturas que
            atendam aos critérios selecionados na listagem abaixo.
          </p>
        </div>
        <div class="col-span-2">
          <AnalysisChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AnalysisChart from "./AnalysisChart.vue";

export default defineComponent({
  components: { AnalysisChart },
  data() {
    return {
      isOpenAnalisys: true,
    };
  },
});
</script>
