/*
 * @Author: chengshanshan 
 * @Date: 2018-08-27 11:00:05 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-27 11:00:49
 * @instraction:自定义目录模块，目录模板组件
 */

<template>
    <div class="wrapper">
        <p class="title">{{temData.templateName}}</p>
        <div class="content">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wenjianbao"></use>
            </svg>
        </div>
        <p class="bottom">
            <span class="btn" long type="text" @click="templateView">{{$t('title.view')}}</span>
            <span class="btn" long type="text" @click="tempalteUse" :class='{"disabled":temData.using}'>{{$t('title.userTemplate')}}</span>
        </p>
    </div>
</template>
<script>
export default {
  props: {
      temData:{
          type:Object,
          default(){
              return {
                 templateId:0, 
                 templateName:"",
                 using:false
              }
          }
      },

  },
  methods: {
    templateView() {
      //查看模板
      this.$emit("on-view",this.temData.templateId);
    },
    tempalteUse() {
      //使用模板
      this.$emit("on-use",this.temData.templateId);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/css/variable.scss";
.wrapper {
  border: 1px solid $border-color;
  border-radius: 3px;
  text-align: center;
  margin-bottom: 10px;
  .title {
    padding: 10px 5px;
  }
  .content {
    text-align: center;
    font-size: 40px;
    padding: 10px 5px;
  }
  .bottom {
    display: flex;
    justify-content: space-around;
    padding: 5px;
    .btn{
      width: 100%;
      &:hover{
        cursor: pointer;
      }
      &.disabled{
       color: #ccc;
        cursor: not-allowed;
      }
    }
  }
}
</style>


