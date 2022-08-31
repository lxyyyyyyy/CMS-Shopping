<template>
  <div class="dashboard-container">
    <card></card>
    <sale></sale>
    <observe></observe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import card from './card/index.vue'
import sale from './sale/index.vue'
import observe from './observe/index.vue'
import { mount } from '@vue/test-utils'

export default {
  components:{
    card,sale,observe
  },
  name: 'Dashboard',
  mounted(){
    this.$store.dispatch('getData');

  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
  
}
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
