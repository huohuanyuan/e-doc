/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 10:15:54 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-28 15:28:31
 */

<template>
  <div class="document-wrapper" ref="outWrapper">
    <div ref="topWrapper">
      <ul class="top">
        <li @click="getFileRecover" v-show="replyShow">
          <Icon type="reply"></Icon>{{$t('file.recover')}} </li>
      </ul>
      <split></split>
    </div>
    <Table highlight-row :height="tableHeight" :columns="fileTableCol" :data="fileTableData" @on-sort-change="sortChange" @on-selection-change="selectChange"></Table>
    <div class="page" ref="bottomWrapper">
      <Page :total="pageTotal" show-elevator show-sizer show-total size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
    </div>
  </div>
</template>
<script>
import {
  ApiGetRecycleList,
  ApiGetFileRecover
} from "@/api/document/recycle-api";
import { resCode} from "common/js/code";
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
      tableHeight: 100,
      selection: [],
      replyShow: false,
      fileTableCol: [
        {
          type: "selection",
          width: 35
        },
        {
          key: "fileName",
          title: this.$t('file.name'),
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
          key: "createdTime",
          title: this.$t('file.createTime'),
          sortable: "custom",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              moment(params.row.createdTime).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },

        {
          key: "updatedTime",
          title: this.$t('file.delTime'),
          align: "center",
          sortable: "custom",
          render: (h, params) => {
            return h(
              "div",
              moment(params.row.updatedTime).format("YYYY-MM-DD HH:mm:ss")
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
        order: ""
      }
    };
  },
  methods: {
    init() {
      this.getRecycleList();
    },
    computeHeight() {
      this.$nextTick(function() {
        let outH = this.$refs.outWrapper.offsetHeight;
        let bottomH = this.$refs.bottomWrapper.offsetHeight;
        let topH = this.$refs.topWrapper.offsetHeight;
        let contentHeight = outH - bottomH - topH;
        this.tableHeight = contentHeight;
      });
    },
    getRecycleList() {
      ApiGetRecycleList(this.fileListParams).then(res => {
        if (res.code == "success") {
          this.fileTableData = res.data;
          this.pageTotal = res.total;
        } else {
             this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //排序
    sortChange(params) {
      this.fileListParams.sortKey = params.key;
      this.fileListParams.order = params.order;
      this.getRecycleList();
    },
    //分页
    pageChange(value) {
      this.fileListParams.pageNum = value;
      this.getRecycleList();
    },
    pageSizeChange(value) {
      this.fileListParams.pageSize = value;
      this.getRecycleList();
    },
    //选中行
    selectChange(selection) {
      if (selection.length > 0) {
        this.replyShow = true;
      } else {
        this.replyShow = false;
      }
      this.selection = selection;
    },
    // 恢复文件
    getFileRecover() {
      if (this.selection.length > 0) {
        let selectionList = [];
        for (let i = 0; i < this.selection.length; i++) {
          selectionList.push(this.selection[i].fileId);
        }
        let data = {
          fileIds: selectionList
        };
        ApiGetFileRecover(data).then(res => {
          if (res.code == "success") {
            this.$Message.success(this.$t('note.fileRecallSuccess'));
            this.getRecycleList();
          } else {
                this.$Message.error(resCode(this, res.code));
          }
        });
      }
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

