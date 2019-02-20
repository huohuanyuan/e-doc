<template>
  <div class="search-div">
    <div class="file-div">
      <Card>
        <p slot="title"> {{$t('title.fileSearch')}} </p>
        <div class="file-table">
          <Table stripe :columns="fileColumns" :data="fileList"></Table>
          <div class="page">
            <Page :total="file.total" size="small" :current="file.pageNum" :page-size="file.size" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
            </Page>
          </div>
        </div>
      </Card>
    </div>
    <!-- <div class="dir-div">
      <Card>
        <p slot="title"> {{$t('title.folderSearch')}} </p>
        <div v-if="divTreeShow">
          <Row :gutter="16">
            <Col span="6">
            <div>
              <el-tree :data="dirTreeData" :render-content="renderContent" @node-click="dirSelected" empty-text=" ">
              </el-tree>
            </div>
            </Col>
            <Col span="18">
            <div>
              <Table stripe :columns="fileColumns" :data="fileList"></Table>

            </div>
            </Col>
          </Row>
        </div>
        <p v-else> {{$t('title.searchNull')}} </p>
      </Card>
    </div> -->
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
import {
  ApiGetCommonSearchFile,
  ApiGetCommonSearchDir
} from "@/api/search/search-api.js";
import {
  ApiGetFileDelete,
  ApiGetFileSendTo,
  ApiGetAcceptTask
} from "@/api/document/common-api";
import { ApiPostFlowSave } from "@/api/pdf-api";
import OperateDropdown from "components/units/operate-dropdown";
import FileIcon from "components/units/file-icon";
import FileHistory from "components/file-history";
import FileRecord from "components/file-record";
import FileFlow from "components/file-flow";
import ReviewPop from "components/units/review-pop";
import moment from "moment";
import { resCode, fileStatus } from "@/common/js/code.js";
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
      file: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      divTreeShow: false,
      dirTreeData: [],
      fileList: [],
      fileColumns: [
        {
          key: "fileName",
          title: this.$t("file.name"),
          sortable: "custom",
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
          sortable: "custom",
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
          sortable: "custom",
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
      deleteData: {},
      deleteModel: false,
      deleteLoading: false
    };
  },
  methods: {
    // 文件 分页
    handlePage(value) {
      this.file.pageNum = value;
      this.getCommonSearchFile();
    },
    handlePageSize(value) {
      this.file.pageSize = value;
      this.getCommonSearchFile();
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
            cursor: "pointer"
          }
        },
        [
          h(
            "svg",
            {
              class: "icon",
              style: {
                "font-size": "20px"
              },
              attrs: {
                "aria-hidden": true
              }
            },
            [
              h("use", {
                attrs: {
                  "xlink:href": "#icon-wenjianbao"
                }
              })
            ]
          ),
          h(
            "span",
            {
              style: {
                padding: "0 10px"
              }
            },
            `${data.folderName}(${data.id})`
          )
        ]
      );
    },
    // 获取 flie 列表
    getCommonSearchFile() {
      let data = {
        pageNum: this.file.pageNum,
        pageSize: this.file.pageSize,
        searchMessage: this.$route.query.searchMessage
      };
      ApiGetCommonSearchFile(data).then(res => {
        if (res.code == "success") {
          this.fileList = res.data;
          this.file.total = res.total;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    getCommonSearchDir() {
      let data = {
        searchMessage: this.$route.query.searchMessage
      };
      ApiGetCommonSearchDir(data).then(res => {
        if (res.code == "success") {
          if (
            res.data.artifactList.length == 0 &&
            res.data.folderList.length == 0 &&
            res.data.sectionList.length == 0 &&
            res.data.zoneList.length == 0
          ) {
            this.divTreeShow = false;
          } else {
            this.divTreeShow = true;
          }
          if (res.data.artifactList.length > 0) {
            for (let i = 0; i < res.data.artifactList.length; i++) {
              this.dirTreeData.push(res.data.artifactList[i]);
            }
          }
          if (res.data.folderList.length > 0) {
            for (let i = 0; i < res.data.folderList.length; i++) {
              this.dirTreeData.push(res.data.folderList[i]);
            }
          }
          if (res.data.sectionList.length > 0) {
            for (let i = 0; i < res.data.sectionList.length; i++) {
              this.dirTreeData.push(res.data.sectionList[i]);
            }
          }
          if (res.data.zoneList.length > 0) {
            for (let i = 0; i < res.data.zoneList.length; i++) {
              this.dirTreeData.push(res.data.zoneList[i]);
            }
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    dirSelected() {},
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
          //如果当前表格数据只有一条，则请求上一页
          if (this.fileTableData.length == 1) {
            this.fileListParams.pageNum =
              this.fileListParams.pageNum > 1
                ? --this.fileListParams.pageNum
                : 1;
          }
          this.getMyDocList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    /**
     * 文件发送流程
     * @param {Object} param 发送请求参数
     */
    sendTo(param) {
      ApiGetFileSendTo(param).then(res => {
        if (res.code == "success") {
          this.getCommonSearchFile();
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
          this.getCommonSearchFile();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //接收任务
    accpetTask(params) {
      ApiGetAcceptTask(params.fileId).then(res => {
        if (res.code == "success") {
          this.getCommonSearchFile();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.getCommonSearchFile();
      // this.getCommonSearchDir();
    }
  },
  mounted() {
    this.getCommonSearchFile();
    // this.getCommonSearchDir();
  }
};
</script>
<style lang="scss" scoped>
.file-div {
  margin-bottom: 20px;
}
</style>
