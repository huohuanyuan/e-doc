<template>
    <div class="m-chart" ref="mChart" :style="setSize"></div>
</template>

<script>
// import echarts from 'echarts'            // 引入 ECharts 所有模块（这里建议按需引入项目所需模块）
import echarts from "echarts/lib/echarts"; // 引入 ECharts 主模块
import "echarts/lib/chart/line"; // 引入线图
import "echarts/lib/chart/bar"; // 引入柱状图
import "echarts/lib/chart/pie"; // 引入环形图
import "echarts/lib/component/tooltip"; // 引入提示框组件
import "echarts/lib/component/legend"; // 引入图例组件

export default {
  name: "mChart",
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "200px"
    },
    option: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    option() {
      this.initChart();
    }
  },
  computed: {
    setSize() {
      return `width: ${this.width}; height: ${this.height};`;
    }
  },
  mounted() {
    this.initChart();
    this.screenResize();
  },
  methods: {
    initChart() {
      const mChart = echarts.init(this.$refs.mChart);
      mChart.setOption(this.option);
      mChart.resize();
    },
    screenResize() {
      window.onresize = () => {
        this.initChart();
      };
    }
  }
};
</script>

<style lang="scss">
//   .m-chart {
//     background: $color-white;
//   }
</style>
