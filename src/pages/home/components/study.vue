/*
 * @Author: liuhaosheng 
 * @Date: 2018-08-03 10:25:00 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-04 11:01:35
 * 项目 list 页面
 */
<template>
  <div class="study-info">
    <router-link to="home-page">
      <p class="back">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        {{$t('operation.return')}}
      </p>
    </router-link>
    <div class="table">
      <div class="study-table">
        <div class="table-div">
          <Table :columns="studyColumns" :data="studyData" highlight-row @on-current-change="onClickRow"></Table>
        </div>
        <div class="page">
          <Page :total="study.total" size="small" :current="study.pageNum" :page-size="study.pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
          </Page>
        </div>
      </div>
      <div class="site-table">
        <div class="table-div">
          <Table :columns="siteColumns" :data="siteData" highlight-row></Table>
        </div>
        <div class="page">
          <Page :total="site.total" size="small" :current="site.pageNum" :page-size="site.pageSize" show-elevator show-sizer show-total @on-change="siteHandlePage" @on-page-size-change='siteHandlePageSize'>
          </Page>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ApiGetCommonStudy,
  ApiGetCommonStudySite,
  ApiPostCommonStudy
} from "@/api/home/home";
import { resCode } from "@/common/js/code.js";
import Util from "common/js/util";
import qs from "qs";

const linkButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "primary",
        size: "small"
      },
      style: {
        marginRight: "5px"
      },
      on: {
        click: () => {
          vm.postCommonStudy(params.row);
        }
      }
    },
    "进入"
  );
};
export default {
  data() {
    return {
      study: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      site: {
        studyId: "",
        isAll: "",
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      studyColumns: [
        {
          width: 80,
          align: "center",
          title: this.$t("title.numerical"),
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.study.pageNum - 1) * vm.study.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: this.$t("title.study"),
          key: "study_name",
          align: "center"
        }
      ],
      siteColumns: [
        {
          width: 80,
          align: "center",
          title: this.$t("title.numerical"),
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.site.pageNum - 1) * vm.site.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: this.$t("title.site"),
          key: "siteName",
          align: "center"
        },
        {
          title: this.$t("operation.operation"),
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [linkButton(this, h, params)]);
          }
        }
      ],
      studyData: [],
      siteData: []
    };
  },
  methods: {
    handlePage(value) {
      this.study.pageNum = value;
      this.getCommonStudy();
    },
    handlePageSize(value) {
      this.study.pageSize = value;
      this.getCommonStudy();
    },
    siteHandlePage(value) {
      this.site.pageNum = value;
      this.getCommonStudySite();
    },
    siteHandlePageSize(value) {
      this.site.pageSize = value;
      this.getCommonStudySite();
    },
    // 请求 Study 列表
    getCommonStudy() {
      let _this = this;
      ApiGetCommonStudy(_this.study).then(function(res) {
        if (res.code == "success") {
          _this.studyData = res.data;
          _this.study.total = res.total;
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    // 点击 study列表
    onClickRow(currentRow, oldCurrentRow) {
      this.site.studyId = currentRow.study_id;
      this.site.isAll = currentRow.is_all;
      this.site.studyName = currentRow.study_name;
      this.getCommonStudySite();
    },
    // 请求 site 列表
    getCommonStudySite() {
      let _this = this;
      ApiGetCommonStudySite(_this.site).then(function(res) {
        if (res.code == "success") {
          if (_this.site.isAll > 0) {
            res.data.unshift({ siteId: 0, siteName: "--" });
          }
          _this.siteData = res.data;
          _this.site.total = res.total;
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    postCommonStudy(row) {
      let data = {
        studyId: this.site.studyId,
        siteId: row.siteId
      };

      let _this = this;
      ApiPostCommonStudy(qs.stringify(data)).then(res => {
        if (res.code == "success") {
          this.$Message.success(this.$t("note.changeSucc"));
          sessionStorage["siteName"] = row.siteName;
          sessionStorage["studyName"] = this.site.studyName;
          // this.$store.commit("setStudyName", this.site.studyName);
          // this.$store.commit("setSiteName", row.siteName);
          Util.setPriMenuList(res.data.menu);
          //保存权限
          localStorage.setItem("privilege", JSON.stringify(res.data.privilege));
          location.reload();
        } else {
          _ththisis.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  mounted() {
    this.getCommonStudy();
  }
};
</script>
<style lang="scss">
@import "../../../common/css/base.scss";
@import "../../../common/css/mixin.scss";

.study-info {
  .back {
    padding: 5px;
    color: #8c9996;
  }
  .table {
    text-align: center;
    .study-table,
    .site-table {
      background: #fff;
      display: inline-block;
      width: 45%;
      padding: 10px;
      border: 1px solid $border-color;
      border-radius: 4px;
    }
    .table-div {
      @include commonStyle($width: 100%, $height: 500px, $borderRadius: 4px);
    }
    .site-table {
      margin-left: 2%;
    }
    .ivu-table th {
      border-top: none;
    }
  }
}
</style>
