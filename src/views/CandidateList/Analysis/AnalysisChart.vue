<template>
    <vue-funnel-graph
    :width="width"
    :height="height" 
    :labels="labels"
    :values="values" 
    :colors="colors" 
    :sub-labels="subLabels" 
    :direction="direction"
    :gradient-direction="gradientDirection"
    :animated="true"
    :display-percentage="true"
    ></vue-funnel-graph>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import "vue3-funnel-graph-js/dist/style.css";
import { VueFunnelGraph } from "vue3-funnel-graph-js";

export default defineComponent({
  props: [],
  components: {
    VueFunnelGraph
  },
  data() {
      return {
          labels: ['Impressions', 'Add To Cart', 'Buy'],
          subLabels: ['Direct', 'Social Media', 'Ads'],
          values: [
          // with the given Labels and SubLabels here's what the values represent:
          // 
          // Direct, Social, Ads  
          //    |      |     |  
          //    v      v     v
              [3000, 2500, 6500], // Segments of "Impressions" from top to bottom
              [3000, 1700, 1000], // Segments of "Add To Cart"
              [600,  200,  130]   // Segments of "Buy"
          ],
          colors: [
              ['#FFB178', '#FF3C8E'], // color set for "Impressions" segment
              ['#A0BBFF', '#EC77FF'], // color set for "Add To Cart" segment
              ['#A0F9FF', '#7795FF']  // color set for "Buy" segment
          ],
          direction: 'vertical',
          gradientDirection: 'vertical',
          height: 300,
          width: 300
      };
  }
});
</script>