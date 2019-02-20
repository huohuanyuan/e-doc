<template>
  <div ref="outWrapper" class="all-document">
    <div class="doc-content" ref="contentWrapper">
      <div class="file-tree">
        <div class="title" ref="titleWrapper">
          <div>{{$t('file.name')}}</div>
          <div>
            <Dropdown style="margin-left: 20px" placement="bottom-end" @on-click="fileTreeSort">
              <a href="javascript:void(0)">
                {{$t('file.sort')}}
                <Icon type="arrow-down-b"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="0">{{$t('file.defaultSort')}}</DropdownItem>
                <DropdownItem name="1">{{$t('file.timeSort')}}</DropdownItem>
                <DropdownItem name="2">{{$t('file.folderSort')}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div class="content">
          <div class="spin-container" ref="spinContainer" v-show="spinShow">
            <Spin size="large" fix></Spin>
          </div>
          <div ref="treeWrapper" class="tree-content">
            <el-tree :data="fileTreeData" :render-content="renderContent" @node-click="dirSelected" empty-text=" ">
            </el-tree>
          </div>
        </div>
      </div>
      <div class="file-list">
        <Table highlight-row :height="fileTableHeight" :columns="fileTableCol" :data="fileTableData" @on-sort-change="sortChange"></Table>
        <div class="page" ref="bottomWrapper">
          <Page :total="pageTotal" show-elevator show-sizer show-total size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        </div>
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
//0:自定义 1：模板
import {
  ApiGetAllDocTree,
  ApiGetAllDocList
} from "@/api/document/all-document-api";
import { ApiGetFileDelete, ApiGetFileSendTo,  ApiGetAcceptTask } from "@/api/document/common-api";
import { resCode, fileStatus } from "common/js/code";
import { ApiPostFlowSave} from "@/api/pdf-api";
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
    OperateDropdown,
    Split,
    FileIcon,
    FileHistory,
    FileRecord,
    FileFlow,
    ReviewPop
  },
  data() {
    return {
      //权限
      privileges: {
        modify: true,
        delete: true
      },
      //只有选择一行时才显示修改或删除按钮
      showBtns: {
        modify: false,
        delete: false
      },
      fileTableCol: [
        {
          key: "fileName",
          title: this.$t('file.name'),
          sortable: "custom",
          minWidth: 200,
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
          key: "versionNo",
          title: this.$t('file.versionNo'),
          align: "center"
        },
        {
          key: "updatedTime",
          title: this.$t('file.updateTime'),
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
          key: "archive",
          title: this.$t('file.status'),
          sortable: "custom",
          align: "center",
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
          title: this.$t('operation.operation'),
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
                  acceptTask:params.row.acceptTask
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
                   "accept-task":_data => {
                  this.accpetTask(_data)
                }
              }
            });
          }
        }
      ],
      fileTableData: [],
      pageTotal: 0,
      fileListParams: {
        pageNum: 1,
        pageSize: 10,
        sortKey: "",
        order: "",
        folderType: "", //folderType{ 0 TMF 1 自定义} folderId
        folderId: ""
      },
      fileTableHeight: 100,
      spinShow: false,
      fileTreeData: [], //文件树数据
      sortNum: 0, //文件树排序参数
      deleteData: {},
      deleteModel: false,
      deleteLoading: false
    };
  },
  methods: {
    init() {
      this.getFileTree();
    },
    computeHeight() {
      this.$nextTick(function() {
        let outH = this.$refs.outWrapper.offsetHeight;
        let contentHeight = outH;
        this.$refs.contentWrapper.style.height = `${contentHeight}px`;
        let titleH = this.$refs.titleWrapper.offsetHeight;
        let bottomH = this.$refs.bottomWrapper.offsetHeight;
        this.fileTableHeight = contentHeight - bottomH;
        this.$refs.treeWrapper.style.height = `${contentHeight - titleH}px`;
        this.$refs.spinContainer.style.height = `${contentHeight - titleH}px`;
      });
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
            `${data.title}(${data.fileCount})`
          )
        ]
      );
    },
    //获取文件树
    getFileTree() {
      this.spinShow = true;
      ApiGetAllDocTree({ sort: this.sortNum }).then(res => {
        this.spinShow = false;
        if (res.code == "success") {
          this.fileTreeData = res.data;
        } else {
             this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //文件树排序
    fileTreeSort(name) {
      this.sortNum = name;
      this.getFileTree();
    },
    //获取文件列表
    getFileList() {
      ApiGetAllDocList(this.fileListParams).then(res => {
        if (res.code == "success") {
          this.fileTableData = res.data;
          this.pageTotal = res.total;
        } else {
          this.fileTableData = [];
            this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //选择目录请求下一级文件
    dirSelected(value) {
      this.fileListParams.folderType = value.folderType;
      this.fileListParams.parentId = value.folderId;
      //模板目录到最后一级再获取目录下文件 folderType{ 0 TMF 1 自定义}
      if (value.folderType == 0) {
        if (!value.children) {
          this.getFileList();
        } else {
          this.fileTableData = [];
        }
      } else if (value.folderType == 1) {
        this.getFileList();
      }
    },
    //排序
    sortChange(params) {
      this.fileListParams.sortKey = params.key;
      this.fileListParams.order = params.order;
      this.getFileList();
    },
    //分页
    pageChange(value) {
      this.fileListParams.pageNum = value;
      this.getFileList();
    },
    pageSizeChange(value) {
      this.fileListParams.pageSize = value;
      this.getFileList();
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
          //如果当前表格数据只有一条，则请求上一页
          if (this.fileTableData.length == 1) {
            this.fileListParams.pageNum =
              this.fileListParams.pageNum > 1
                ? --this.fileListParams.pageNum
                : 1;
          }
          this.getFileList();
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
          this.getFileList();
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
          this.getFileList();
        } else {
             this.$Message.error(resCode(this, res.code));
        }
      });
    },
       //接收任务
    accpetTask(params) {
      ApiGetAcceptTask(params.fileId).then(res => {
        if (res.code == "success") {
          this.getFileList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  mounted() {
    this.init();
  },
  updated() {
    this.computeHeight();
  },
  watch: {
    $router(to, from) {
      this.init();
      this.computeHeight();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../common/css/variable.scss";
@import "../../../common/css/mixin.scss";
.all-document {
  height: 100%;
}
.top {
  @include btnGroup();
}

.doc-content {
  display: flex;
  .file-tree {
    width: 30%;
    .title {
      display: flex;
      height: 41px;
      line-height: 41px;
      padding: 0 20px;
      justify-content: space-between;
      border-top: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
    }
    .content {
      border-right: 1px solid $border-color;

      overflow: auto;
    }
    .tree-content {
      padding: 15px 0;
    }
    .spin-container {
      position: relative;
      top: 0;
      bottom: 0;
    }
  }
  .file-list {
    width: 70%;
  }
}
</style>
