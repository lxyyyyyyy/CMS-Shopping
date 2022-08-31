<template>
    <a :title="title" style="margin:10px">
        <!-- $attrs属于子组件的一个属性，可以获取到父组件的数据 和props一样也能接受到父组件传递的数据-->
        <!-- $listeners可以获取到父组件传递给子组件的事件 -->
        <el-button v-bind="$attrs" v-on="$listeners"></el-button>
        <!-- v-bind = $attrs接受了所有父组件上绑定的属性 -->
        
    </a>
</template>

<script>
export default {
    name: 'HintButton',
    props:['title'],
    //用props接收的数据，用attrs是接受不到的

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