<template>
  <el-card shadow="always" class="search">
    <div slot="header" class="header">
      <span>热门搜索</span>

      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
          <el-dropdown-item>Action 3</el-dropdown-item>
          <el-dropdown-item disabled>Action 4</el-dropdown-item>
          <el-dropdown-item divided>Action 5</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- card body -->
    <div class="charts">
      <el-row :gutter="10">
        <el-col :span="12" :offset="0">
          <line-chart></line-chart>
        </el-col>
        <el-col :span="12" :offset="0">
          <line-chart></line-chart>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="排名" width="80">
        </el-table-column>
        <el-table-column prop="name" label="搜索关键字" width="180">
        </el-table-column>
        <el-table-column prop="address" label="用户数" sortable>
        </el-table-column>
        <el-table-column prop="address" label="周涨幅" sortable>
        </el-table-column>
      </el-table>
      <!-- @size-change="sizeChange"
        @current-change="getPageList" -->
      <el-pagination
        
        style="margin-top: 20px; textalign: center"
        :current-page="page"
        :total="total"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout="->,prev, pager, next, jumper, sizes,total"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import lineChart from "./lineCharts/index.vue";
export default {
  name: "searchCard",
  components: {
    lineChart,
  },

  data() {
    return {
      tableData: [],
      limit:5,
      total:10,
      page:0
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style  scoped>
.search .header {
  display: flex;
  justify-content: space-between;
}
</style>