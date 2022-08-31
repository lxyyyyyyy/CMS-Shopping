<template>
  <div>
    <el-card shadow="always" style="margin: 20px 0px">
      <CategorySelect
        :show="!show"
        @getCategoryId="getCategoryId"
      ></CategorySelect>
    </el-card>
    <el-card shadow="always">
      <div v-show="scene == 0">
        <!-- 展示spu列表 -->
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border stripe :data="records">
          <el-table-column
            type="index"
            key=" "
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="Spu名称" width=" ">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width=" ">
          </el-table-column>
          <el-table-column prop="prop" label="SPU操作" width=" ">
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="spu添加"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="spu编辑"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                size="mini"
                icon="el-icon-info"
                title="spu查看"
                @click="handler(row)"
              ></hint-button>
              <hint-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="spu删除"
              ></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- @size-change="sizeChange"改变每一页展示的数量
            current-change改变每一页的列表
                -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="sizeChange"
        >
        </el-pagination>
      </div>
      <spuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></spuForm>
      <skuForm
        v-show="scene == 2"
        ref="sku"
        @changeScene="changeScene"
      ></skuForm>
    </el-card>
    <!-- 放一个对话框 -->
    <el-dialog :title="`${spu.spuName}`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width:100%" v-loading="loading">
        <el-table-column
          property="skuName"
          label="名称"
          width=""
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width=""
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width=""
        ></el-table-column>
        <el-table-column
          label="默认图片"
          width=""
        >
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
        </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import spuForm from "./spuForm";
import skuForm from "./skuForm";
export default {
  name: "Spu",

  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",

      //控制三级联动的可操作性
      show: true,

      //接收平台属性的字段
      SpuList: [],
      page: 1, //分页器当前的页数
      limit: 3, //每一页展示的数据条数
      records: [], //spu列表的数据
      total: 0, //分页器一共显示数据的条数
      scene: 0, //0代表spu列表 1 代表修改 2代表sku

      dialogTableVisible: false,
      spu:{},
      skuList:[],
      loading :true,
    };
  },

  mounted() {},

  methods: {
    //  //点击分页器第几页按钮的回调
    // currentChange(page){
    //   this.page = page;
    //   this.getSpuList();
    // },
    //   三级联动的自定义事件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取属性展示列表
        this.getSpuList();
      }
    },
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      //携带三个参数:page 第几页  limit 每一页需要展示多少条数据  三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    sizeChange(limit) {
      //当分页器每一页展示的条数发生变化
      //修改参数、再次发请求
      this.limit = limit;
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
    },
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    changeScene(scene) {
      //看看父组件是否接收到了子组件传递来的scene
      // console.log(scene);

      //切换scene
      this.scene = scene;
    },
    addSku(row) {
      this.scene = 2;
      //获取到子组件中的方法getData
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    async handler(row){
      this.dialogTableVisible = true;
      this.spu = row;
      //发送请求
      let result = await this.$API.spu.reqSkuList(row.id);
      if(result.code == 200){
        this.skuList = result.data;
        this.loading = false;

      }
    },
    close(done){
      this.loading = true;
      this.skuList = [];
      done();

    },
  },
  components: {
    spuForm,
    skuForm,
  },
};
</script>

<style lang="scss" scoped>
</style>