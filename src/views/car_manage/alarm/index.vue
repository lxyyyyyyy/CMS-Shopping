<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name</div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!--
      lable显示标题
      data展示的数据，数组
      width 对应列的宽度
      align对齐方式
      table组件展示的数据是以一列
      prop:对应列内容的字段名
    -->
    <el-table border stripe :data="list">
      <el-table-column type="index" key="col.id" label="车辆id" width="80px">
      </el-table-column>
      <el-table-column prop="tmName" label="label" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="pic" width="width">
        <template slot-scope="{ row, $index }">
          <img src="row.logoUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="logoUrl" label="pic" width="width">
        <template slot-scope="{ row, $index }">
          <!-- 修改品牌，传参，修改哪个品牌，发送请求给服务器 -->
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateCar(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCar(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页器
    当前页currentpage，数据的总条数total，每一页展示的条数page-size
    pagesizes设置每一页展示多少条数
    layout设置分页器布局
    page-count 设置连续的页码按钮数量
    -->

    <el-pagination
      @size-change="sizeChange"
      @current-change="getPageList"
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :total="total"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->, sizes,total"
    >
    </el-pagination>

    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 绑定数据，model表示将表单的数据收集到哪个对象中 -->
      <!-- Form提供了表单验证的功能，只需要通过rules属性传入约定的验证规则，并将Form-item的prop属性设置为需要校验  的字段名 -->
      <el-form :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item
          label="车辆名称"
          :label-width="formLabelWidth"
          prop="tmName"
        >
          <!-- 通过v-model绑定数据 -->
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>

        <el-form-item label="添加图片" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据不能使用v-model
          action设置图片上传的地址 api
          :on-success:可以检测到图片上传成功,图片上传成功会执行一次
          :before-upload:在图片上传之前会执行一次-->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 上传图片 -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addOrUpdate">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "alarm",
  data() {
    return {
      page: 1,
      limit: 4,
      //总共数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //对话框显示与否控制
      dialogFormVisible: false,
      formLabelWidth: "120px",
      imageUrl: "",
      //声明收集数据的对象
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        //品牌名称的验证规则
        //需要验证的名字
        tmName: [
          {
            required: true, //必须要输入内容,**的处处，message提示信息，trigger用户行为设置
            message: "Please input Activity name",
            trigger: "blur",
          },
          {
            min: 3,
            max: 5,
            message: "Length should be 3 to 5",
            trigger: "change", //文本发生变化的时候触发
          },
        ],
        logoUrl: [
          {
            required: true,
            message: "Please select 品牌图片",
          },
        ],
      },
    };
  },
  mounted() {
    //获取列表数据方法
    this.getPageList();
  },
  methods: {
    //获取列表数据
    async getPageList(pager = 1) {
      this.page = pager;
      //解构出参数
      const { page, limit } = this;
      //获取列表接口
      let result = await this.$API.alarm.reqAlarmList(page, limit);
      if (result.code == 200) {
        //分别是展示数据总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    sizeChange(limit) {
      //整理参数
      this.limit = limit;
      this.getPageList();
    },
    //点击添加车辆的按钮
    showDialog() {
      //添加对话框
      this.dialogFormVisible = true;
      //每次执行完清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    updateCar(row) {
      console.log(row);
      this.dialogFormVisible = true;
      //添加前拷贝,防止直接修改
      this.tmForm = row;
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("Avatar picture must be JPG format!");
      }
      if (!isLt2M) {
        this.$message.error("Avatar picture size can not exceed 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加修改点击确定以后
    addOrUpdate() {
      //表单验证正确再写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部符合条件
        if (success) {
          this.dialogFormVisible = false; //点击确定以后对话框隐藏
          //发请求，修改品牌，添加品牌
          let result = await this.$API.alarm.reqAddOrUpdate(this.tmForm);
          if (result.code == 200) {
            //弹出信息，上传成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            //添加或修改品牌成功，再次获取品牌列表进行展示
            this.getPageList();
          } else {
            console.log("error");
            return false;
          }
        }
      });
    },
    //删除品牌
    deleteCar(row) {
      //弹出框
      this.$confirm(
        `将永久删除${row.tmName}，是否确定删除？`, //模板字符串
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        //点击确定按钮触发,发请求
        .then(async () => {
          //发送请求
          let result = await this.$API.alarm.reqDeleteCar(row.id);
          if (result === 200) {
            this.$message({
              type: "success",
              message: "Delete completed",
            });
            //再次获取品牌列表数据,如果列表数据大于一，停留在当前页面，小于1则回到上一页
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        //取消按钮触发
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
  },
};
</script>

<style>
.dashboard-container {
  margin: 30px;
}
.dashboard-container .dashboard-text {
  font-size: 30px;
  line-height: 46px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #252525;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
