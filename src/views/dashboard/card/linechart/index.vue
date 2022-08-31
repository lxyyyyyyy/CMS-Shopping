<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineChart",

  data() {
    return {};
  },

  mounted() {
    //初始化echarts实例
    let linechart = echarts.init(this.$refs.charts);
    //配置数据
    linechart.setOption({
      xAxis: {
        //隐藏坐标轴
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "line",
          data: [10, 22, 44, 22, 11, 34, 70, 29, 13, 22, 42, 21, 70, 23, 80],
          smooth: true,
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            color: "purple",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0.1,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 0.8,
                  color: "white",
                   // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },

  methods: {},
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>