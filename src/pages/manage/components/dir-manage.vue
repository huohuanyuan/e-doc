/*
 * @Author: chengshanshan 
 * @Date: 2018-08-06 14:02:52 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-23 14:23:07
 */

<template>
    <div class="dir-wrapper" ref="outerWrapper">
        <div ref="topWrapper" class="top-wrapper">
            <ul class="top">
                <li>
                    <router-link :to="{name:'tmfDir'}">{{$t('title.tmfFolder')}}</router-link>
                </li>
                <li>
                    <router-link :to="{name:'customDir'}">{{$t('title.customFolder')}}</router-link>
                </li>
            </ul>
            <split></split>
        </div>
        <div class="content" ref="contentWrapper">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import Split from "components/units/split";

export default {
  components: {
    Split
  },
  methods: { 
    computeHeight() {
      //计算页面高度
      this.$nextTick(function() {
        let outH = this.$refs.outerWrapper.offsetHeight;
        let topH = this.$refs.topWrapper.offsetHeight;
        let contentHeight = outH - topH;
        this.$refs.contentWrapper.style.height = `${contentHeight}px`;
      });
    }
  },
  watch: {
    $route(to, from) {
      this.computeHeight();
    }
  },
  mounted() {
    this.computeHeight();
  }
};
</script>
<style lang="scss" scoped>
@import "../../../common/css/mixin.scss";
.dir-wrapper {
  height: 100%;
  background: #fff;
  overflow: hidden;
  .top-wrapper{
    border-bottom: 1px solid $border-color;
  }
  .top {
    @include btnGroup();
    a {
      color: $font-light-color;
      &.router-link-active {
        color: $theme-blue;
      }
    }
  }
  .content{
    min-height: calc(100% - 22px)
  }
}
</style>