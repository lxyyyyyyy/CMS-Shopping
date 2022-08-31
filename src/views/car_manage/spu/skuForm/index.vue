<template>
  <div>
    <el-form ref="form" label-width="80px" size="normal">
      <el-form-item label="SPU名称">{{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量">
        <el-input v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-form label-width="80px" :inline="true" size="normal">
          <el-form-item
            :label="attr.attrName"
            size="normal"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select
              placeholder="pick"
              clearable
              filterable
              v-model="attr.attrIdAndValueId"
            >
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性" size="normal">
        <el-form label-width="80px" :inline="true" size="normal">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="pick"
              clearable
              filterable
              v-model="saleAttr.AttrIdAndValueId"
            >
              <el-option
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" size="normal">
        <el-table
          border
          stripe
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" prop=" " width=" ">
          </el-table-column>
          <el-table-column prop=" " label="图片" width=" ">
            <!-- 作用域插槽展示图 -->
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" alt="" style="width: 80px; height: 80px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width=" ">
          </el-table-column>
          <el-table-column prop=" " label="操作" width=" ">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="default"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button type="text" size="mini" v-else @click=""
                >默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuForm",

  data() {
    return {
      //存储图片数据
      spuImageList: [],
      //存储销售属性数据
      spuSaleAttrList: [],
      //平台属性数据
      attrInfoList: [],
      spu:{},
      //收集sku数据
      skuInfo: {
        //以下三项可以从父组件中获取到
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //通过双向绑定可以收集到的数据
        skuName: "",
        price: 0,
        weight: 0,
        skuDesc: "",
        skuDefaultImg: "",
        //收集图片信息
        skuImageList: [
          // {
          //   id:0,
          //   imgName:"",
          //   imgUrl:"",
          //   skuId:0,
          //   spuImgId:0,
          // }
        ],

        // 收集销售属性
        skuAttrValueList: [
          // {
          //   sttrId: 0,
          //   valueId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
      },
      //收集图片的数据字段
      imageList: [],
    };
  },

  mounted() {},

  methods: {
    //获取sku数据
    async getData(category1Id, category2Id, row) {
      //获取从父组件中传递来的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;
      //获取图片
      let result = await this.$API.spu.reqSpuImageList(row.id);
      if (result.code == 200) {
        //接收服务器返回的数据
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(row.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      //获取平台属性数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    handleSelectionChange(p) {
      this.imageList = p;
    },
    changeDefault(row) {
      //当点击按钮，先把每个图片的defaul属性变成0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      //再把当前的default属性变成1
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScene", 0);
      //清除数据
      Object.assign(this._data, this.$options.data());
      //this._data.xx其实就是this.xx,assign表示拷贝对象，this.$options.data()为返回原始数据
      // 所以可以通过 Object.assign(this.$data,this.$options.data.call(this)) 重置数据为当前组件的初始数据
    },
    async save() {
      //收集数据，整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //发送请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({type:'success',message:"success"});
        this.$emit('changeScene',0);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>