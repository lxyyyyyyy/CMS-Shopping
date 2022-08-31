<template>
  <div>
    <!-- inline代表行内表单 表示一行可以放多个表单元素-->
    <el-form :inline="true" class="demo-form-inline" v-model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"

        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"

        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['show'],

  data() {
    return {
      //一级分类的数据
      list1: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      list2: [],
      list3: [],
    };
  },
  //组件挂载完毕，向服务器发请求，获取相应一级分类的数据
  mounted() {
    this.getCategory1List();
  },

  methods: {
    async getCategory1List() {
      //获取一级分类数据的方法
      let result = await this.$API.info.reqCategory1List();
      if (result.code == 200) {
        //把服务器的数据赋值给list1[]
        this.list1 = result.data;
      }
    },
    //一级分类的事件回调（当一级分类的option发生变化的时候获取相应的二级分类的数据
    async handler1() {
      //清除二级三级的数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = '';
      this.cForm.category3Id = '';
      //解构出一级分类的id,从cForm下获取到category1Id
      const { category1Id } = this.cForm;
      //把子组件下的Id传递给父组件
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
      let result = await this.$API.info.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    async handler2() {
      this.list3 = [];
      this.cForm.category3Id = '';
      //解构出一级分类的id,从cForm下获取到category1Id
      const { category2Id } = this.cForm;
      this.$emit("getCategoryId", {categoryId:category2Id,level:2});

      let result = await this.$API.info.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    //三级分类的事件回调
    handler3() {
      //解构出三级分类的id,从cForm下获取到category3Id
      const { category3Id } = this.cForm;
      this.$emit("getCategoryId", {categoryId:category3Id,level:3});

    },
  },
};
</script>

<style lang="scss" scoped>
</style>