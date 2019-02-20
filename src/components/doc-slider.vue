/*
 * @Author: chengshanshan 
 * @Date: 2018-07-20 09:38:01 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-28 15:36:03
 * @instranction:左边主导航
 */
 <template>
    <div class="doc-slider">
        <div v-for="(item,index) of menuList" :key="index" class="cell">
            <router-link :to="{name:item.priv}">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="iconCode[item.priv]"></use>
                </svg>
                <p>{{pageCode[item.priv]}}</p>
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      pageCode: {
        home: this.$t("page.home"),
        document: this.$t("page.document"),
        library: this.$t("page.library"),
        report: this.$t("page.report"),
        manage: this.$t("page.manage")
      },
      iconCode: {
        home: "#icon-shouye",
        document: "#icon-wendang",
        library: "#icon-wenjianku",
        report: "#icon-baobiaozhongxin",
        manage: "#icon-guanli"
      }
    };
  },
  props: {
    menuList: {
      type: Array,
      required: true
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common/css/variable.scss";
.doc-slider {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid $border-color;
  background-color: #fff;
  border-radius: 5px;
  margin-right: 10px;
  .cell {
    padding: 10px 0;
    text-align: center;
    a {
      color: #525e5a;
      &.router-link-active {
        color: $theme-green;
      }
    }
    .icon {
      font-size: 35px;
      margin-bottom: 10px;
    }
  }
}
</style>

 
