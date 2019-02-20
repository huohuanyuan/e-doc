/*
 * @Author: chengshanshan 
 * @Date: 2018-08-06 14:02:52 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-11-19 15:33:14
 */

<template>
  <div class="down-wrapper" ref="outerWrapper">
    <div ref="topWrapper" class="top-wrapper">
      <ul class="top">
        <li v-for="(item,index) of childrenRouter">
          <router-link :to="{name:item.priv}">{{pageCode[item.priv]}}</router-link>
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
  data() {
    return {
      pageCode: {
        allDocDown: this.$t("page.allFile"),
        coreDocDown: this.$t("file.submitfile"),
        uncoreDocDown: this.$t("file.noSubmit"),
        downTask: this.$t("title.downloadTask")
      },
      childrenRouter: [] //子路由列表
    };
  },
  methods: {
    computeHeight() {
      //计算页面高度
      this.$nextTick(function() {
        let outH = this.$refs.outerWrapper.offsetHeight;
        let topH = this.$refs.topWrapper.offsetHeight;
        let contentHeight = outH - topH - 22;
        this.$refs.contentWrapper.style.height = `${contentHeight}px`;
      });
    }
  },
  computed: {
    menuList() {
      let dataSource = JSON.parse(localStorage.getItem("menuList"));
      let res = [];
      let _menuList = [];
      // 每一层的数据都 push 进 res
      res.push(...dataSource);
      // res 动态增加长度
      for (var i = 0; i < res.length; i++) {
        var curData = res[i];
        _menuList.push(curData);
        // 如果有 children 则 push 进 res 中待搜索
        if (curData.children.length > 0) {
          res.push(...curData.children);
        }
      }
      return _menuList;
    }
  },
  watch: {
    $route(to, from) {
      this.computeHeight();
    }
  },
  mounted() {
    this.computeHeight();
    let currentPageList = this.menuList.filter((currentVal, index) => {
      return currentVal.priv == this.$route.meta.parent;
    });

    this.childrenRouter = currentPageList[0].children;
  }
};
</script>
<style lang="scss" scoped>
@import "../../../common/css/mixin.scss";
.down-wrapper {
  height: 100%;
  background: #fff;
  overflow: hidden;
  .top {
    @include btnGroup();
    a {
      color: $font-light-color;
      &.router-link-active {
        color: $theme-blue;
      }
    }
  }
  .content {
    min-height: calc(100% - 22px);
  }
}
</style>