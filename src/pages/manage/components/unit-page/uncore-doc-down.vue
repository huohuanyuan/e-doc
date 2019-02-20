/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 10:15:59 
 * @Last Modified by: liuhaosheng
 * @Last Modified time: 2018-11-19 16:17:09
 */
<template>
  <div class="down-wrapper" ref="outerWrapprer">
    <div class="file-tree">
      <div class="title" ref="topWrapper">
        <div>
          <Checkbox v-model="isSelectAll" @on-change="selectAll">{{$t('title.folder')}}</Checkbox>
        </div>
        <div>
          <span class="btn" @click="folderDown" v-show="showDownBtn">{{$t('operation.down')}}</span>
        </div>
      </div>
      <div class="content">
        <div class="spin-container" ref="spinContainer" v-show="spinShow">
          <Spin size="large" fix></Spin>
        </div>
        <div ref="treeWrapper" class="tree-content">
          <el-tree ref="tree" :data="dirTreeData" node-key="id" :render-content="renderContent" show-checkbox @node-click="dirSelected" @check="nodeCheck" empty-text=" ">
          </el-tree>
        </div>
      </div>
    </div>
    <div class="file-list">
      <Table :height="fileTableHeight" :columns="fileTableCol" :data="fileTableData" @on-sort-change="sortChange"></Table>
      <div class="page" ref="bottomWrapper">
        <Page :total="pageTotal" show-elevator show-sizer show-total size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
    <!--  下载任务的模态框 -->
    <Modal :title="$t('title.createTask')"  v-model="downModel">
      <Form ref="downForm" :model="downForm" :rules="downFormRule" :label-width="90">
        <FormItem :label="$t('title.taskName')" prop="taskName">
          <Input v-model="downForm.taskName">
          </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" long @click="downSaveFun('downForm')">{{$t('operation.save')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import qs from "qs";
import Split from "components/units/split";
import FileIcon from "components/units/file-icon";
import { resCode, fileStatus } from "common/js/code";
import moment from "moment";
import {
  ApiGetLibraryFolder,
  ApiGetLibraryFileList
} from "@/api/library/library-api";
import {
  ApiGetMultiFolderPackage,
  ApiGetFileDown
} from "@/api/manage/down-center-api";
export default {
  components: {
    Split,
    FileIcon
  },
  data() {
    return {
      // 下载文件
      downModel: false,
      downForm: {
        taskName: ""
      },
      downFormRule: {
        taskName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            max: 256,
            message: "姓名长度不能超过256位",
            trigger: "blur"
          }
        ]
      },
      spinShow: false,
      isSelectAll: false,
      showDownBtn: false,
      fileTableCol: [
        {
          key: "fileName",
          title: this.$t("file.name"),
          sortable: "custom",
          minWidth: 200,
          render: (h, params) => {
            return h(FileIcon, {
              props: {
                fileType: params.row.fileType,
                fileName: params.row.fileName,
                fileDir: params.row.folder,
                fileVersionId: params.row.fileVersionId,
                fileId: params.row.fileId,
                onlineView: params.row.onlineView,
                view: params.row.view
              }
            });
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
          key: "archive",
          title: this.$t("file.status"),
          sortable: "custom",
          align: "center",
          render: (h, params) => {
            return h("div", fileStatus(this, params.row.fileStatus));
          }
        },
        {
          key: "opreate",
          title: this.$t("operation.operation"),
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  size: "small"
                },
                on: {
                  click: () => {
                    this.siginFileDown(params.row);
                  }
                }
              },
              this.$t("operation.down")
            );
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
        parentId: "",
        central: false
      },
      fileTableHeight: 100,
      dirTreeData: [], //文件树数据
      allSelectArr: [],
      zipType: "zip"
    };
  },
  methods: {
    init() {
      this.getAllTree();
    },
    computeHeight() {
      //计算页面高度
      this.$nextTick(function() {
        let outH = this.$refs.outerWrapprer.offsetHeight;
        let topH = this.$refs.topWrapper.offsetHeight;
        let bottomH = this.$refs.bottomWrapper.offsetHeight;
        let contentHeight = outH - topH;
        this.fileTableHeight = contentHeight;
        this.$refs.treeWrapper.style.height = `${contentHeight}px`;
        this.$refs.spinContainer.style.height = `${contentHeight}px`;
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
    getAllTree() {
      this.spinShow = true;
      ApiGetLibraryFolder({ central: false }).then(res => {
        this.spinShow = false;
        if (res.code == "success") {
          this.dirTreeData = res.data;
          for (let [index, elem] of this.dirTreeData.entries()) {
            this.allSelectArr.push(elem.id);
          }
        } else {
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
    getFileList() {
      let _this = this;
      ApiGetLibraryFileList(this.fileListParams).then(function(res) {
        if (res.code == "success") {
          _this.fileTableData = res.data;
          _this.pageTotal = res.total;
        } else {
          _this.fileTableData = [];
          _this.$Message.error(resCode(_this, res.code));
        }
      });
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
    nodeCheck(checkedNodes, checkedKeys) {
      if (checkedKeys.checkedNodes.length > 0) {
        this.showDownBtn = true;
      } else {
        this.showDownBtn = false;
      }
    },
    //目录全选
    selectAll(value) {
      if (value) {
        //设置全选
        this.$refs.tree.setCheckedKeys(this.allSelectArr);
        this.showDownBtn = true;
      } else {
        //取消全选
        this.$refs.tree.setCheckedKeys([]);
        this.showDownBtn = false;
      }
    },
    //文件包下载
    folderDown() {
      this.downModel = true;
      this.$refs["downForm"].resetFields();
    },
    // 建立下载任务点击保存
    downSaveFun(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let _str = this.$refs.tree.getCheckedKeys().join("-");
          this.multiFolderPackage(_str);
        }
      });
    },
    /**
     * 多个文件包打包
     *  @params { String } idListStr , 目录类型和id(Z_12-S_12-S_13)
     */
    multiFolderPackage(idListStr) {
      // const downLoading = this.$Message.loading({
      //   content: this.$t("title.downLoading"),
      //   duration: 0
      // });
      let _data = {
        taskName: this.downForm.taskName,
        idListStr: idListStr,
        libraryType: "recom"
      };
      ApiGetMultiFolderPackage(_data).then(res => {
        if (res.code == "success") {
          this.$Message.success(this.$t("note.successTask"));
          this.downModel = false;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    /**
     * 下载单个文件
     */
    siginFileDown(params) {
      ApiGetFileDown(params.fileType, params.fileVersionId).then(res => {
        if (res.code == "success") {
          // let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = res.data;
          link.setAttribute(
            "download",
            `${params.fileName}.${params.fileType}`
          );
          document.body.appendChild(link);
          link.click();
          link.remove();
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
@import "../../../../common/css/mixin.scss";
.down-wrapper {
  height: 100%;
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
      .btn {
        display: inline-block;
        padding: 0 5px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .content {
      border-right: 1px solid $border-color;
    }
    .tree-content {
      padding: 15px 0;
      overflow: auto;
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


