<template>
  <el-card shadow="always">
    <div slot="header" class="header">
      <span>销售额类别占比</span>
      <div>
        <el-radio-group v-model="radio1" size="mini">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <!-- card body -->
    <div class="charts" ref="charts"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "categoryCard",

  data() {
    return {
      radio1: "全部渠道",
    };
  },

  mounted() {
    let bingcharts = echarts.init(this.$refs.charts);
    bingcharts.setOption({
        title:{
            text:"视频",
            subtext:"1048",
            left:'center',
            top:'center'
        },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],

    });
    //设置事件
    bingcharts.on("mouseover",(param)=>{
        const {name,value} = param.data;
        bingcharts.setOption({
            title:{
                text:name,
                subtext:value
            }
        })
    })
  },

  methods: {},
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>