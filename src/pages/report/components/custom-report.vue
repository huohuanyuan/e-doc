<template>
  <div class="custom-wrap" ref="outWrapper">
    <div class="custom-header" ref="topWrapper">
      <router-link class="btn" v-for="(item,index) of childrenRouter" :to="{name:item.priv}" :key="index">{{pageCode[item.priv]}}</router-link>

      <span class="cell" @click="downLoadFun('csv')" v-show="downShow && privilege.reportDown">{{$t('title.CVSDown')}}</span>
      <span class="cell" @click="downLoadFun('pdf')" v-show="downShow && privilege.reportDown">{{$t('title.PDFDown')}}</span>
      <span class="custom-back" @click="infoShowFun" v-if="!infoShow">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        {{$t('operation.return')}}
      </span>
    </div>
    <div class="content" ref="contentWrapper">
      <div class="custom-info" v-if="infoShow">
        <Form ref="customRole" :model="customRole" :rules="customInline" class="from-role" :label-width="60" label-position="left">
          <Row :gutter="16">
            <Col span="12">
            <FormItem prop="siteId" :label="$t('title.site')" v-if="siteShow">
              <Select v-model="customRole.siteId" multiple>
                <Option v-for="item in siteList" :value="item.siteId" :key="item.siteId">{{ item.siteName }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem prop="numberInput" :label="$t('title.attribute')">
              <Input v-model="customRole.numberInput" disabled></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>
        <div class="info">
          <Row :gutter="16">
            <Col span="6" v-for="(item,index) in fileAttribute" :key="index">
            <div>
              <Card @click.native="onClickShow(item)">
                <div class="div-card">
                  <span> {{index + 1}} </span>
                  <span class="name"> {{item.name}} </span>
                  <Icon type="ios-checkmark" :class="{'active-card': item.show===true}"></Icon>
                </div>
              </Card>
            </div>
            </Col>
          </Row>
        </div>
        <div class="footer-btn">
          <Button type="primary" @click="getReportCustom">{{$t('title.view')}}</Button>
        </div>
      </div>
      <div class="custom-table" v-else>
        <Table :columns="customColumns" :data="customTableData" stripe></Table>
      </div>
    </div>
  </div>
</template>
<script>
import { ApiGetManageStudySites } from "@/api/file/file.js";
import {
  ApiGetReportCustom,
  ApiGetReportDown
} from "@/api/report/report-api.js";
import { resCode } from "@/common/js/code.js";

import axios from "axios";
import moment from "moment";

export default {
  components: {},
  data() {
    return {
      pageCode: {
        systemReport: this.$t("page.systemReport"),
        customReport: this.$t("page.customReport")
      },
      childrenRouter: [], //子路由列表
      infoShow: true,
      siteShow: false,
      downShow: false,
      customInline: {},
      customRole: {
        siteId: [0],
        numberInput: this.$t("title.attribute")
      },
      siteList: [],
      fileAttribute: [
        {
          key: "folder",
          name: this.$t("title.folder"),
          show: false
        },
        {
          key: "file_name",
          name: this.$t("file.name"),
          show: false
        },
        {
          key: "file_type_id",
          name: this.$t("title.format"),
          show: false
        },
        {
          key: "study_id",
          name: this.$t("title.study"),
          show: false
        },
        {
          key: "site_id",
          name: this.$t("title.site"),
          show: false
        },
        {
          key: "effective_date",
          name: this.$t("file.effectiveDate"),
          show: false
        },
        {
          key: "expiration_date",
          name: this.$t("file.expirationDate"),
          show: false
        },
        {
          key: "version_no",
          name: this.$t("file.versionNo"),
          show: false
        },
        {
          key: "file_code",
          name: this.$t("file.code"),
          show: false
        },
        {
          key: "status_id",
          name: this.$t("file.status"),
          show: false
        },
        {
          key: "comment",
          name: this.$t("file.comment"),
          show: false
        },
        {
          key: "createdtime",
          name: this.$t("file.createTime"),
          show: false
        },
        {
          key: "updatedtime",
          name: this.$t("file.updateTime"),
          show: false
        }
      ],
      checkList: [],
      customColumns: [
        {
          type: "index",
          width: 80,
          align: "center",
          title: "序号"
        }
      ],
      customTableData: []
    };
  },
  methods: {
    computeHeight() {
      //计算页面高度
      this.$nextTick(function() {
        let outH = this.$refs.outWrapper.offsetHeight;
        let topH = this.$refs.topWrapper.offsetHeight;
        let contentHeight = outH - topH - 22; //padding + border：20
        this.$refs.contentWrapper.style.height = `${contentHeight}px`;
      });
    },
    getManageStudySites() {
      ApiGetManageStudySites().then(res => {
        if (res.code == "success") {
          res.data.unshift({ siteId: 0, siteName: "--" });
          this.siteList = res.data;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    onClickShow(item) {
      item.show = !item.show;
      if (item.show) {
        if (this.checkList.length == 0) {
          this.checkList.push(item);
        } else {
          for (let i = 0; i < this.checkList.length; i++) {
            if (this.checkList[i].key == item.key) {
              return false;
            }
          }
          this.checkList.push(item);
        }
      } else {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].key == item.key) {
            this.checkList.splice(i, 1);
          }
        }
      }
      if (this.checkList.length > 0) {
        this.downShow = true;
      } else {
        this.downShow = false;
      }
    },
    getReportCustom() {
      if (this.checkList.length == 0) {
        this.$Message.warning(this.$t("note.selectFileA"));
        return false;
      }
      let customQueryId = [];
      for (let i = 0; i < this.checkList.length; i++) {
        customQueryId.push(this.checkList[i].key);
        if (this.checkList[i].key == "file_type_id") {
          this.customColumns.push({
            title: this.checkList[i].name,
            key: "type",
            align: "center"
          });
        } else if (this.checkList[i].key == "status_id") {
          this.customColumns.push({
            title: this.checkList[i].name,
            key: "status",
            align: "center"
          });
        } else if (this.checkList[i].key == "study_id") {
          this.customColumns.push({
            title: this.checkList[i].name,
            key: "studyName",
            align: "center"
          });
        } else if (this.checkList[i].key == "site_id") {
          this.customColumns.push({
            title: this.checkList[i].name,
            key: "siteName",
            align: "center"
          });
        } else if (this.checkList[i].key == "createdtime") {
          this.customColumns.push({
            title: this.checkList[i].name,
            key: this.checkList[i].key,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.createdtime
                    ? moment(params.row.createdtime).format("YYYY-MM-DD  HH:mm")
                    : "";
                })(this)
              );
            }
          });
        } else if (this.checkList[i].key == "updatedtime") {
          this.customColumns.push({
            title: this.checkList[i].name,
            key: this.checkList[i].key,
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                (function(vm) {
                  return params.row.updatedtime
                    ? moment(params.row.updatedtime).format("YYYY-MM-DD  HH:mm")
                    : "";
                })(this)
              );
            }
          });
        } else {
          this.customColumns.push({
            title: this.checkList[i].name,
            key: this.checkList[i].key,
            align: "center"
          });
        }
      }
      let data = {
        customQuery: customQueryId.join(","),
        queryType: "property"
      };
      if (this.siteId == 0) {
        if (this.customRole.siteId.length == 0) {
          this.$Message.warning(this.$t("note.selectSite"));
          return false;
        }
        data.siteId = this.customRole.siteId.join(",");
      } else {
        data.siteId = this.siteId;
      }

      ApiGetReportCustom(data).then(res => {
        if (res.code == "success") {
          this.customTableData = res.data;
          this.infoShow = false;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 下载 文件
    downLoadFun(type) {
      let customQueryList = [];
      for (let i = 0; i < this.checkList.length; i++) {
        customQueryList.push(this.checkList[i].key);
      }
      let lsiteId;
      if (this.siteId == 0) {
        lsiteId = this.customRole.siteId.join(",");
      } else {
        lsiteId = this.siteId;
      }
      customQueryList = customQueryList.join(",");
      let _data = {
        customQuery: customQueryList,
        siteId: lsiteId,
        queryType: "property",
        reportType: type
      };
      ApiGetReportDown(_data).then(data => {
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `自定义报表.${_data.reportType}`);
        document.body.appendChild(link);
        link.click();
      });
    },
    infoShowFun() {
      this.infoShow = !this.infoShow;
      this.customColumns = [
        {
          type: "index",
          width: 80,
          align: "center",
          title: this.$t("title.numerical")
        }
      ];
    }
  },
  computed: {
    siteId() {
      return sessionStorage.getItem("siteId");
    },
    privilege() {
      return JSON.parse(localStorage.getItem("privilege"));
    }
  },
  mounted() {
    if (this.siteId == 0) {
      this.getManageStudySites();
      this.siteShow = true;
    } else {
      this.siteShow = false;
    }

    let _menuList = JSON.parse(localStorage.getItem("menuList"));
    let currentPageList = _menuList.filter((currentVal, index) => {
      return currentVal.priv == this.$route.meta.parent;
    });

    this.childrenRouter = currentPageList[0].children;
    this.computeHeight();
  }
};
</script>
<style lang="scss" scoped>
@import "../../../common/css/variable.scss";
@import "../../../common/css/mixin.scss";

.custom-wrap {
  height: 100%;
  overflow: hidden;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  border: 1px solid $border-color;
  .custom-header {
    padding: 5px 0 15px 0;
    border-bottom: 1px solid $border-color;
  }
    .content {
    overflow: auto;
    padding:0 20px;
  }
  .btn {
    margin-right: 10px;
    @include btn();
 
  }
  .active {
    background-color: $theme-green;
    color: #fff;
  }
  .cell {
    color: $theme-green;
    padding: 6px 15px;
    &:hover {
      cursor: pointer;
    }
  }
  .custom-info {
    margin-top: 20px;
  }
  .ivu-card-bordered {
    cursor: pointer;
    .name {
      margin-left: 20px;
    }
  }

  .div-card {
    .ivu-icon {
      float: right;
      font-size: 16px;
      color: $border-color;
    }
  }
  .info {
    .ivu-col-span-6 {
      margin-bottom: 10px;
    }
    .active-card {
      color: $theme-green;
    }
  }
  .footer-btn {
    width: 100%;
    margin: 100px 0;
    text-align: center;
    button {
      width: 50%;
    }
  }
  .custom-back {
    float: right;
    margin-right: 20px;
    margin-top: 5px;
    cursor: pointer;
  }
}
</style>
