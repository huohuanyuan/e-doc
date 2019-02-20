/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 10:15:59 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-23 17:25:02
 */
<template>
  <div class="doc-wrapper" ref="docWrapper">
    <div class="top" ref="docTop">
      <div>
        <router-link class="btn" v-for="(item,index) of childrenRouter" :to="{name:item.priv}" :key="index">{{pageCode[item.priv]}}</router-link>
      </div>
      <split></split>
    </div>
    <div class="content" ref="docContentWrapper">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Split from "components/units/split";
import OperateDropdown from "components/units/operate-dropdown";
export default {
  components: {
    Split,
    OperateDropdown
  },
  data() {
    return {
      pageCode: {
        newFile: this.$t('page.newFile'),
        recentDocument: this.$t('page.recentOperation'),
        myDocument: this.$t('page.myFile'),
        allDocument: this.$t('page.allFile'),
        recycle: this.$t('page.recycle')
      },
      childrenRouter: [] //子路由列表
    };
  },
  methods: {
    init() {},
    computeHeight() {
      //计算页面高度
      this.$nextTick(function() {
        let outH = this.$refs.docWrapper.offsetHeight;
        let topH = this.$refs.docTop.offsetHeight;
        let contentHeight = outH - topH - 22; //padding + border：20
        this.$refs.docContentWrapper.style.height = `${contentHeight}px`;
      });
    }
  },
  computed: {
    menuList() {
      return JSON.parse(localStorage.getItem("menuList"));
    }
  },
  watch: {
    $route(to, from) {
      this.computeHeight();
    }
  },
  mounted() {
    this.computeHeight();
    let _menuList = this.menuList;
    let currentPageList = _menuList.filter((currentVal, index) => {
      return currentVal.priv == this.$route.meta.parent;
    });
    this.childrenRouter = currentPageList[0].children;
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/css/mixin.scss";
.doc-wrapper {
  height: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 10px;
  border: 1px solid $border-color;
  overflow: hidden;
  .btn {
    margin-right: 10px;
    @include btn();
  }
  .cell {
    color: $theme-green;
    padding: 6px 15px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>


