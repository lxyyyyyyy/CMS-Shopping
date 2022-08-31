<template>
    <div style="margin-top: 10px">
        <el-row :gutter="10">
            <el-col :span="12" :offset="0">
                <search-card></search-card>
            </el-col>
            <el-col :span="12" :offset="0">
                <category-card></category-card>
            </el-col>
        </el-row>
        
    </div>
</template>
<script>
import searchCard from './search/index.vue'
import categoryCard from './category/index.vue'
export default {
    name: 'observe',
    components:{
        searchCard,
        categoryCard
    },

    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>

<style lang="scss" scoped>

</style>