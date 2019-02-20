/*
 * @Author: liuhaosheng 
 * @Date: 2018-07-24 15:42:25 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-12-18 14:51:20
 */
<template>
  <div class="available">
    <router-link to="home-page">
      <p class="back">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fanhui"></use>
        </svg>
        {{$t('operation.return')}}
      </p>
    </router-link>
    <div class="table">
      <p class="table-p"> {{$t('file.optionalTask')}} </p>
      <Table :columns="availableColumns" :data="availableData" @on-sort-change="sortChange"></Table>
      <div class="page">
        <Page :total="available.total" size="small" :current="available.pageNum" :page-size="available.pageSize" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
        </Page>
      </div>
    </div>
    <!-- 删除确认 -->
    <Modal v-model="deleteModel" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{$t('operation.delete')}}</span>
      </p>
      <div style="text-align:center">
        <p v-html="$t('operation.deleteNoRecover',{name:deleteData.fileName})"></p>
      </div>
      <div slot="footer">
        <Button type="error" long @click="deleleSave">{{$t('operation.doDelete')}}</Button>
      </div>
    </Modal>
    <file-history></file-history>
    <file-record></file-record>
    <!-- 不支持在线查看的文件的审阅审批流程model-->
    <file-flow @flow-save="flowSave"></file-flow>
  </div>
</template>
<script>
import { ApiGetMyavailable } from "@/api/home/home";
import { resCode, fileStatus } from "@/common/js/code.js";
import {
  ApiGetFileDelete,
  ApiGetFileSendTo,
  ApiGetAcceptTask
} from "@/api/document/common-api";
import { ApiPostFlowSave } from "@/api/pdf-api";
import moment from "moment";

import OperateDropdown from "components/units/operate-dropdown";
import FileIcon from "components/units/file-icon";
import FileHistory from "components/file-history";
import FileRecord from "components/file-record";
import FileFlow from "components/file-flow";
import ReviewPop from "components/units/review-pop";
import qs from "qs";

export default {
  components: {
    OperateDropdown,
    FileIcon,
    FileHistory,
    FileRecord,
    FileFlow,
    ReviewPop
  },
  data() {
    return {
      deleteData: {},
      deleteModel: false,
      available: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      availableColumns: [
        {
          key: "fileName",
          title: this.$t("file.name"),
          sortable: true,
          minWidth: 400,
          render: (h, params) => {
            return h(FileIcon, {
              props: {
                fileType: params.row.fileType,
                fileName: params.row.fileName,
                fileDir: params.row.folder,
                view: params.row.view,
                fileVersionId: params.row.fileVersionId,
                fileId: params.row.fileId,
                onlineView: params.row.onlineView
              }
            });
          }
        },
        {
          key: "fileCode",
          title: this.$t("file.code"),
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                if (params.row.fileCode) {
                  return params.row.fileCode;
                } else {
                  return "--";
                }
              })(this)
            );
          }
        },
        {
          key: "versionNo",
          title: this.$t("file.versionNo"),
          align: "center"
        },
        {
          key: "updatedTime",
          title: this.$t("file.updateTime"),
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h(
              "div",
              moment(params.row.updatedTime).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          key: "fileStatus",
          title: this.$t("file.status"),
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("p", [
              h(
                "span",
                {
                  style: {
                    "padding-right": "5px"
                  }
                },
                fileStatus(this, params.row.fileStatus)
              ),
              (function(vm) {
                if (Array.isArray(params.row.failComments)) {
                  if (params.row.failComments.length > 0) {
                    return h(ReviewPop, {
                      props: {
                        failComments: params.row.failComments
                      }
                    });
                  }
                }
              })(this)
            ]);
          }
        },
        {
          key: "opreate",
          title: this.$t("operation.operation"),
          align: "center",
          render: (h, params) => {
            return h(OperateDropdown, {
              props: {
                dropdownItems: {
                  edit: params.row.edit,
                  delete: params.row.delete,
                  record: params.row.record,
                  history: params.row.history,
                   download:params.row.download,
                  sendReview: params.row.sendReview,
                  sendQc: params.row.sendQc,
                  sendApprove: params.row.sendApprove,
                  toReview: params.row.toReview,
                  toQc: params.row.toQc,
                  toApprove: params.row.toApprove,
                  acceptTask: params.row.acceptTask
                },
                fileId: params.row.fileId,
                updatedTime: params.row.updatedTime,
                siteId: params.row.siteId,
                fileVersionId: params.row.fileVersionId,
                fileName: params.row.fileName,
                view: params.row.view,
                onlineView: params.row.onlineView,
                fileType: params.row.fileType
              },
              on: {
                "send-to": _data => {
                  this.sendTo(_data);
                },
                "file-delete": _data => {
                  this.deleteModel = true;
                  this.deleteData = _data;
                },
                "accept-task": _data => {
                  this.accpetTask(_data);
                }
              }
            });
          }
        }
      ],
      availableData: []
    };
  },
  methods: {
    handlePage(value) {
      this.available.pageNum = value;
      this.getMyavailable();
    },
    handlePageSize(value) {
      this.available.pageSize = value;
      this.getMyavailable();
    },
    // 请求可接受任务
    getMyavailable() {
      let _this = this;
      let type = this.$route.query.operationType;
      _this.available.operationType = type;
      ApiGetMyavailable(_this.available).then(function(res) {
        if (res.code == "success") {
          _this.availableData = res.data;
          _this.available.total = res.total;
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    /**
     * 文件发送流程
     * @param {Object} param 发送请求参数
     * @param {number} index 表格数据行数，修改table数据使用，避免重新刷新列表
     */
    sendTo(param, index) {
      ApiGetFileSendTo(param).then(res => {
        if (res.code == "success") {
          this.getMyavailable();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
      //接收任务
    accpetTask(params) {
      ApiGetAcceptTask(params.fileId).then(res => {
        if (res.code == "success") {
          this.getMyavailable();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //删除保存
    deleleSave() {
      let _data = {
        fileId: this.deleteData.fileId,
        updatedTime: this.deleteData.updatedTime
      };
      ApiGetFileDelete(_data).then(res => {
        if (res.code == "success") {
          this.deleteModel = false;
          this.$Message.success(this.$t("note.delSucc"));
          //如果当前表格数据只有一条，则请求上一页
          if (this.availableData.length == 1) {
            this.available.pageNum =
              this.available.pageNum > 1 ? --this.available.pageNum : 1;
          }
          this.getMyavailable();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    sortChange(data) {
      this.available.sortKey = data.key;
      this.available.order = data.order;
      this.getMyavailable();
    },
    //文件审阅审批保存
    flowSave(data) {
      ApiPostFlowSave(qs.stringify(data)).then(res => {
        if (res.code == "success") {
          this.$store.commit("flowModalToggle", false);
          this.$store.commit("signModalToggle", false);
          this.getMyavailable();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //接收任务
    accpetTask(params) {
      ApiGetAcceptTask(params.fileId).then(res => {
        if (res.code == "success") {
          this.getMyavailable();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  mounted() {
    this.getMyavailable();
  }
};
</script>
<style lang="scss">
@import "../../../common/css/base.scss";
@import "../../../common/css/variable.scss";

.available {
  .back {
    padding: 5px;
    color: #8c9996;
  }
  .table {
    background: #fff;
    border-radius: 8px;
    padding: 10px;
    border: 1px solid $border-color;
    .table-p {
      padding: 10px 20px;
      border-bottom: 1px solid $border-color;
      font-size: 16px;
    }
    .ivu-table th {
      border-top: none;
    }
  }
}
</style>
