<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <card-detail title="销售属性" count="$12367">
                <template slot="charts">
                    <span>周同比</span>
                </template>
                <template slot="footer">
                    <span>日销售额</span>
                </template>
            </card-detail>
        </el-card>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <card-detail title="访问量" count="111111">
                <template slot="charts">
                    <line-chart></line-chart>
                </template>
                <template slot="footer">
                    <span>日销售额</span>
                </template>
            </card-detail>

        </el-card>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <card-detail title="支付笔数" count="222222">
                 <template slot="charts">
                     <bar-chart></bar-chart>
                </template>
                <template slot="footer">
                    <span>日销售额</span>
                </template>
            </card-detail>

        </el-card>
      </el-col>
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <card-detail title="运营活动效果" count="55555">
                 <template slot="charts">
                     <progress-chart></progress-chart>
                </template>
                <template slot="footer">
                    <span>日销售额</span>
                </template>
            </card-detail>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import cardDetail from "./detail/index.vue";
import lineChart from  "./linechart/index.vue"
import barChart from "./barchart/index.vue"
import progressChart from "./progresschart/index.vue"
export default {
  components: {
    cardDetail,
    lineChart,
    barChart,
    progressChart
  },
  name: "card",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>