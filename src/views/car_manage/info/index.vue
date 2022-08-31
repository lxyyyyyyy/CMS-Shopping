<template>
  <div class="dashboard-container">
    <el-card shadow="always" style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>

    <el-card shadow="always">
      <div v-show="isShowTable">
        <!-- 当没有category3Id的时候禁用按钮 -->
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addInfo"
          >添加属性</el-button
        >
        <!-- 使用表格展示平台属性 
      type属性展示序号-->
        <el-table border stripe :data="infoList">
          <el-table-column
            align="center"
            type="index"
            key="序号"
            label="序号"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="attrName"
            key="属性名称"
            label="属性名称"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="attrValueList"
            key="属性值列表"
            label="属性值列表"
            width=" "
          >
            <!-- 插槽 row是平台属性-->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                style="margin: 2px 10px"
                v-for="(infoValue, index) in row.attrValueList"
                :key="infoValue.id"
                >{{ infoValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="col.id" key="col.id" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="updateInfo(row)"
              ></el-button>

              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <!-- 添加或者修改属性的结构 -->
        <el-form
          label-width="80px"
          :inline="true"
          size="normal"
          :model="infoInfo"
        >
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="infoInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addInfoValue"
          :disabled="!infoInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          border
          stripe
          style="margin: 20px 0px"
          :data="infoInfo.attrValueList"
        >
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column
            prop="attrName"
            key="属性名称"
            label="属性名称"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <!-- 需要input和span来回切换 -->
              <el-input
                :ref="$index"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                placeholder="请输入品牌属性"
                v-model="row.valueName"
                size="mini"
              ></el-input>
              <span
                style="display: block"
                v-else
                @click="toEdit(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop=" "
            key="操作"
            label="操作"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <el-popconfirm @onConfirm="deleteAttrValue($index)" :title="`Are you sure to delete ${row.valueName}?`">
                <el-button  type="danger"
                size="mini"
                icon="el-icon-delete" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="AddOrUpdateInfo" :disabled="infoInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "info",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",

      //接收平台属性的字段
      infoList: [],
      isShowTable: true,
      infoInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    //自定义事件的回调
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
        this.getInfoList();
      }
    },
    //获取数据
    async getInfoList() {
      //获取分类的Id
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.info.reqInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.infoList = result.data;
      }
    },
    addInfoValue() {
      //像属性值的数组中添加元素
      this.infoInfo.attrValueList.push({
        attrId: this.infoInfo.id,
        valueName: "",
        //标记切换与否的字段,响应式属性
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.infoInfo.attrValueList.length - 1].focus();
      });
    },
    addInfo() {
      this.isShowTable = false;
      this.infoInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    //修改某一个属性
    updateInfo(row) {
      this.isShowTable = false;
      //将选中的属性赋值给infoInfo
      //深拷贝，引入lodash.结构比较复杂不能用浅拷贝
      this.infoInfo = cloneDeep(row);
      //给修改的属性添加flag，使用响应式属性添加，$set(那个对象，添加新的响应式属性，新的属性值)
      this.infoInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    toLook(row) {
      //失焦的事件
      //添加一个判断，如果输入的属性为空，不能变为查看模式
      if (row.valueName.trim() == "") {
        this.$message("请输入正确的属性");
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepeat = this.infoInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) return;

      row.flag = false;
    },
    toNoLook(row) {
      row.flag = true;
    },
    toEdit(row, index) {
      row.flag = true;
      //获取input节点，实现自动聚焦
      //需要注意点击span的时候，切换为input变为编辑模式，但是页面的重绘需要时间
      //点击span的时候，重回一个input需要时间，不可能一点击span就获取到input
      //$nextTick节点渲染完毕了会执行一次
      this.$nextTick(() => {
        //获取相应的input表单元素实现重绘
        this.$refs[index].focus();
      });
    },
    //气泡确认框确认回调,模板用的版本号
    deleteAttrValue($index){
      this.infoInfo.attrValueList.splice($index,1);
    },
    //保存按钮，添加或者修改属性
    async AddOrUpdateInfo(){
      //整理参数：flag字段和空的属性值不应该提交给服务器
      this.infoInfo.attrValueList=this.infoInfo.attrValueList.filter(item=>{
        if(item.valueName!=""){
          delete item.flag;
          return true;
        }
      })
      //发送请求
      try {
        await this.$API.info.reqAddOrUpdateInfo(this.infoInfo);
        this.$message({type:'success',message:'保存成功'});
        //保存成功以后获取平台属性再次进行展示
        this.getInfoList();
        this.isShowTable=true;
      } catch (error) {
        this.$message({type:'error',message:'保存失败'});
        
      }

    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
