<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "barChart",

  data() {
    return {};
  },

  mounted() {
    //初始化echarts实例
    let barchart = echarts.init(this.$refs.charts);
    //配置数据
    barchart.setOption({
      xAxis: {
        //隐藏坐标轴
        show:false,
        //均分
        type:'category'
      },
      yAxis: {
          show:false,
      },
      series: [
        {
          type: "bar",
          data: [10, 22, 44, 22, 11, 34, 70, 29, 13, 22, 42, 21, 70, 23, 80],
          
      
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

<style  scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>