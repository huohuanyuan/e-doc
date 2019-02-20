<template>
  <div class="manage-wrapper" ref="outWrapper">
    <div class="top" ref="topWrapper">
      <div>
        <router-link class="btn" v-for="(item,index) of childrenRouter" :to="{name:item.priv}" :key="index">{{pageCode[item.priv]}}</router-link>

      </div>
      <split></split>
    </div>
    <div class="content" ref="contentWrapper">
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
        downloadCenter: this.$t("page.downCenter"),
        studyManage: this.$t("page.studyManage"),
        userManage: this.$t("page.userManage"),
        siteManage: this.$t("page.siteManage"),
        noticeManage: this.$t("page.noteManage"),
        privManage: this.$t("page.privilegeManage"),
        dirManage: this.$t("page.folderManage")
      },
      childrenRouter: [] //子路由列表
    };
  },
  methods: {
    init() {},
    computeHeight() {
      //计算页面高度
      this.$nextTick(function() {
        let outH = this.$refs.outWrapper.offsetHeight;
        let topH = this.$refs.topWrapper.offsetHeight;
        let contentHeight = outH - topH - 22; //padding + border：20
        this.$refs.contentWrapper.style.height = `${contentHeight}px`;
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
      return currentVal.priv == "manage";
    });
    this.childrenRouter = currentPageList[0].children;
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/css/mixin.scss";
.manage-wrapper {
  height: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 10px;
  border: 1px solid $border-color;
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
  .content {
    overflow: hidden;
  }
}
</style>
