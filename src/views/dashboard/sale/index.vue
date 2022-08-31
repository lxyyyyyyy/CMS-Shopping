<template>
  <el-card class="box-card" style="margin-top: 10px">
    <div slot="header" class="clearfix">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tab">
        <el-tab-pane label="销售额" name="first"></el-tab-pane>
        <el-tab-pane label="访问量" name="second"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          type="datetimerange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          :default-time="['12:00:00']"
          size="mini"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          v-model="date"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="16" :offset="0">
          <div
            class="charts"
            ref="charts"
            style="width: 100%; height: 300px"
          ></div>
        </el-col>
        <el-col :span="8" :offset="0">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span>aaa</span>
              <span>aaa</span>
              <span>aaa</span>
            </li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import * as dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  name: "sale",
  components: {},

  data() {
    return {
      activeName: "first",
      mychart: null,
      date: "",
    };
  },

  mounted() {
    //初始化echarts实例
    this.mychart = echarts.init(this.$refs.charts);
    //配置数据
    this.mychart.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [],
    });
  },
  computed: {
    title() {
      return this.activeName === "first" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    //监听属性
    title() {
      this.mychart.setOption({
        title: {
          text: this.title,
        },
        //可以切换数据
        xAxis: {
          data:
            this.title == "销售额"
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            color: this.title == "销售额" ? "skyblue" : "#bfc",
            data:
              this.title == "销售额"
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
          },
        ],
      });
    },
    listState() {
      this.mychart.setOption({
        title: {
          text: "销售额趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            color: "skyblue" ,
            data:this.listState.orderFullYear,
          }
        ],
      });
    },
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.right span {
  margin-right: 10px;
  font-size: 14px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
}
</style>