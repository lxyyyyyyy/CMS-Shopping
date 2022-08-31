<template>
  <div>
    <!-- 表格 -->
    <el-table border stripe :data="list">
      <el-table-column type="index" label="序号" width="80 " align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width=" "> </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width=" "> </el-table-column>
      <el-table-column label="默认图片" width="100">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column label="操作" width=" ">
        <template slot-scope="{ row, $index }">
          <hint-button
            type="success"
            size="mini"
            icon="el-icon-sort-down"
            v-if="row.isSale == 0"
            title="上架"
          ></hint-button>
          <hint-button
            type="info"
            size="mini"
            v-else
            icon="el-icon-sort-up"
            title="下架"
          ></hint-button>
          <hint-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="编辑"
          ></hint-button>
          <hint-button
            type="info"
            size="mini"
            icon="el-icon-info"
            title="查看"
          ></hint-button>
          <hint-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            title="删除"
          ></hint-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getSkuList"
      @size-change="sizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "sku",

  data() {
    return {
      page: 1, //代表当前第几页
      limit: 10, //代表当前页面有几条数据
      total: 0,
      list: [],
    };
  },

  mounted() {
    //获取sku列表的方法
    this.getSkuList();
  },

  methods: {
    async getSkuList(pages = 1) {
      this.page = pages;

      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
        console.log();
      }
    },
    sizeChange(limit) {
      //当分页器每一页展示的条数发生变化
      //修改参数、再次发请求
      this.limit = limit;
      this.getSkuList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>