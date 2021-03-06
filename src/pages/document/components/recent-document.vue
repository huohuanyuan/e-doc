/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 10:15:38 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-12-18 14:50:32
 */

<template>
  <div class="document-wrapper" ref="outWrapper">
    <Table highlight-row :height="tableHeight" :columns="fileTableCol" :data="fileTableData"></Table>
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
        <Button type="error" long :loading="deleteLoading" @click="deleleSave">{{$t('operation.doDelete')}}</Button>
      </div>
    </Modal>

    <file-history></file-history>
    <file-record></file-record>
    <!-- 不支持在线查看的文件的审阅审批流程model-->
    <file-flow @flow-save="flowSave"></file-flow>

  </div>
</template>
<script>
import { ApiGetRecentList } from "@/api/document/recent-document-api";
import {
  ApiGetFileDelete,
  ApiGetFileSendTo,
  ApiGetAcceptTask
} from "@/api/document/common-api";
import { ApiPostFlowSave } from "@/api/pdf-api";
import { resCode, fileStatus } from "common/js/code";
import OperateDropdown from "components/units/operate-dropdown";
import Split from "components/units/split";
import FileIcon from "components/units/file-icon";
import FileHistory from "components/file-history";
import FileRecord from "components/file-record";
import FileFlow from "components/file-flow";
import ReviewPop from "components/units/review-pop";
import moment from "moment";
import qs from "qs";
export default {
  components: {
    Split,
    OperateDropdown,
    FileIcon,
    FileHistory,
    FileRecord,
    FileFlow,
    ReviewPop
  },
  data() {
    return {
      tableHeight: 100,
      fileTableCol: [
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
      fileTableData: [],
      pageTotal: 0,

      deleteData: {},
      deleteModel: false,
      deleteLoading: false
    };
  },
  methods: {
    init() {
      this.getRecentList();
    },
    computeHeight() {
      this.$nextTick(function() {
        let outH = this.$refs.outWrapper.offsetHeight;
        let contentHeight = outH;
        this.tableHeight = contentHeight;
      });
    },
    getRecentList() {
      ApiGetRecentList().then(res => {
        if (res.code == "success") {
          this.fileTableData = res.data;
          this.pageTotal = res.total;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //删除保存
    deleleSave() {
      this.deleteLoading = true;
      let _data = {
        fileId: this.deleteData.fileId,
        updatedTime: this.deleteData.updatedTime
      };
      ApiGetFileDelete(_data).then(res => {
        this.deleteLoading = false;
        if (res.code == "success") {
          this.deleteModel = false;
          this.getRecentList();
        } else {
          this.$Message.error(resCode(this, res.code));
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
          this.getRecentList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //文件审阅审批保存
    flowSave(data) {
      ApiPostFlowSave(qs.stringify(data)).then(res => {
        if (res.code == "success") {
          this.$store.commit("flowModalToggle", false);
          this.$store.commit("signModalToggle", false);
          this.getRecentList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //接收任务
    accpetTask(params) {
      ApiGetAcceptTask(params.fileId).then(res => {
        if (res.code == "success") {
          this.getRecentList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.init();
      this.computeHeight();
    }
  },
  mounted() {
    this.init();
  },
  updated() {
    this.computeHeight();
  }
};
</script>
<style lang="scss" scoped>
@import "../../../common/css/mixin.scss";
.document-wrapper {
  height: 100%;
  .top {
    @include btnGroup();
  }
}
</style>
