<template>
  <div>
    <el-form ref="form" label-width="80px" size="normal" :model="spu">
      <el-form-item label="Spu名称">
        <el-input placeholder="Spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select
          value=""
          placeholder="请选择品牌名称"
          clearable
          filterable
          v-model="spu.tmId"
        >
          <el-option
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="Spu描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="Spu图片">
        <!-- action是图片上传的地址 list-type文件列表的类型 file-list展示照片墙，数组中必须有name和url-->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :auto-upload="false"
          :file-list="spuImageList"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" size="normal">
        <el-select
          value=""
          placeholder="未选择"
          clearable
          filterable
          style="inline: block"
        >
          <el-option key="item.value" label="item.label" value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="default" icon="el-icon-plus"
          >添加销售属性</el-button
        >
        <el-table border stripe :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            style="align: center"
          >
          </el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width=" "
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称列表"
            width=" "
          >
            <template slot-scope="row, $index">
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                
              >
              <!-- @close="handleClose(tag)" -->
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" key="key" label="操作" width=" ">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <!-- 点击button以后，触发自定义事件changeScene，给父组件传递参数0 -->
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuForm",

  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      //spu属性初始化的时候是一个空的对象，在修改spu的时候，会向服务器发送请求，返回一个对象，在修改的时候可以利用服务器返回的对象收集最新的数据提交给服务器
      //添加spu，如果添加spu，并没有向服务器发送请求，数据收集到哪里，spu中包含有哪些字段，这是查看文档，保存spu时需要向服务器发送的内容
      spu: {
        //三级分类的id
        category3Id: 0,
        //品牌描述
        description: "",
        //spu名称
        spuName: "",
        //平台id
        tmId: 0,
        //收集spu图片的信息
        spuImageList: [],
        //平台属性与平台属性值收集
        spuSaleAttrList: [],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储spu图片数据
      saleAttrList: [], //销售属性的数据

      dynamicTags: ["Tag 1", "Tag 2", "Tag 3"],
      inputVisible: false,
      inputValue: "",
    };
  },

  mounted() {},

  methods: {
    //照片删除回调
    //file是被删除的当前图片，fileList代表删除以后的剩余图片
    handleRemove(file) {
      this.spuImageList=file;      
    },
    //照片墙预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;//图片的地址
      this.dialogVisible = true;//点击预览，对话框显示
    },
    handleDownload(file) {
      console.log(file);
    },
    
    async initSpuData(row) {
      //获取spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(row.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的信息

      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      //获取图片信息
      let imageResult = await this.$API.spu.reqSpuImageList(row.id);
      if (imageResult.code == 200) {
        let listArr = imageResult.data;
        //需要给返回的数据中每一个都添加name和url才能显示
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      //获取销售属性Id
      let saleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>