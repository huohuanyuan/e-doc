<template>
  <div class="core-library" ref="outWrapper">
    <div ref="topWrapper">
      <ul class="top">
        <li v-for="(item,index) of childrenRouter">
          <router-link class="btn" :to="{name:item.priv}" :key="index">{{pageCode[item.priv]}}</router-link>
        </li>
        <li v-show="showBtn && privilege.noCoreDown" class="cell" @click="fileDown">{{$t('operation.fileDown')}}</li>
        <li v-show="showBtn && privilege.noCoreDown" class="cell" @click="signDown">{{$t('operation.sginDown')}}</li>
        <li v-show="showBtn  && privilege.reCall" class="cell" @click="repeal">{{$t('operation.recall')}}</li>
      </ul>
      <split></split>
    </div>
    <div class="main-content" ref="contentWrapper">
      <div class="file-tree">
        <div class="title" ref="titleWrapper">
          <div>{{$t('title.folder')}}</div>
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
        <Table :height="fileTableHeight" highlight-row :columns="fileTableCol" :data="fileTableData" @on-sort-change="sortChange" @on-current-change="selectRow"></Table>
        <div class="page" ref="bottomWrapper">
          <Page :total="pageTotal" show-elevator show-sizer show-total size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
//0:自定义 1：模板

import {
  ApiGetLibraryFolder,
  ApiGetLibraryFileList,
  ApiGetSignPageDown,
  ApiGetFileRepeal
} from "@/api/library/library-api";
import { ApiGetFileDown } from "@/api/manage/down-center-api";
import { resCode, fileStatus } from "common/js/code";
import Split from "components/units/split";
import FileIcon from "components/units/file-icon";
import moment from "moment";
export default {
  components: {
    Split,
    FileIcon
  },
  data() {
    return {
      pageCode: {
        coreLibrary: this.$t("file.submitfile"),
        uncoreLibrary: this.$t("file.noSubmit")
      },
      showBtn: false,
      childrenRouter: [], //子路由列表
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
          title: this.$t("file.versionNo"),
          align: "center"
        },
        {
          key: "effectiveDate",
          title: this.$t("file.effectiveDate"),
          align: "center",
          sortable: "custom",
          render: (h, params) => {
            return h(
              "div",
              params.row.effectiveDate
                ? moment(params.row.effectiveDate).format("YYYY-MM-DD HH:mm:ss")
                : "--"
            );
          }
        },
        {
          key: "expirationDate",
          title: this.$t("file.expirationDate"),
          sortable: "custom",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              params.row.expirationDate
                ? moment(params.row.expirationDate).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                : "--"
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
      spinShow: false,
      fileTreeData: [], //文件树数据
      sortNum: 0, //文件树排序参数
      currentRow: {} //选中行
    };
  },
  methods: {
    init() {
      this.getFileTree();
    },
    computeHeight() {
      this.$nextTick(function() {
        let outH = this.$refs.outWrapper.offsetHeight;
        let topH = this.$refs.topWrapper.offsetHeight;
        let titleH = this.$refs.titleWrapper.offsetHeight;
        let bottomH = this.$refs.bottomWrapper.offsetHeight;
        let contentHeight = outH - topH - 20; //20像素的padding
        this.fileTableHeight = contentHeight - bottomH;
        this.$refs.contentWrapper.style.height = `${contentHeight}px`;
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
      let _this = this;
      _this.spinShow = true;
      ApiGetLibraryFolder({ central: false }).then(function(res) {
        _this.spinShow = false;
        if (res.code == "success") {
          _this.fileTreeData = res.data;
        } else {
          _this.$Message.error(resCode(_this, res.code));
        }
      });
    },
    //获取文件列表
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
    //选中一行
    selectRow(currentRow, oldCurrentRow) {
      this.showBtn = true;
      this.currentRow = currentRow;
    },
    fileDown() {
      //文件下载
      ApiGetFileDown(
        this.currentRow.fileType,
        this.currentRow.fileVersionId
      ).then(res => {
        if (res.code == "success") {
          // let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = res.data;
          link.setAttribute(
            "download",
            `${this.currentRow.fileName}.${this.currentRow.fileType}`
          );
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      });
    },
    signDown() {
      //签字页下载
      ApiGetSignPageDown(this.currentRow.fileVersionId).then(data => {
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `${this.currentRow.fileName}.pdf`);
        document.body.appendChild(link);
        link.click();
      });
    },
    repeal() {
      //归档文件撤回
      ApiGetFileRepeal({
        fileId: this.currentRow.fileId
      }).then(res => {
        if (res.code == "success") {
          this.getFileList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
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
    },
    privilege() {
      return JSON.parse(localStorage.getItem("privilege"));
    }
  },
  mounted() {
    this.init();
    let currentPageList = this.menuList.filter((currentVal, index) => {
      return currentVal.priv == this.$route.meta.parent;
    });
    this.childrenRouter = currentPageList[0].children;
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
.core-library {
  height: 100%;
  padding: 10px;
  background-color: #fff;
  .top {
    display: flex;
    .btn {
      margin-right: 10px;
      @include btn();
    }
    .cell {
      color: $font-light-color;
      padding: 6px 15px;
      &:hover {
        cursor: pointer;
        color: $theme-green;
      }
    }
  }
  .main-content {
    display: flex;
  }
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
