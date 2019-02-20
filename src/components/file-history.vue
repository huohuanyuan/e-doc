/*
 * @Author: chengshanshan 
 * @Date: 2018-07-26 11:41:04 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-11 17:14:33
 * @instraction:文件历史版本组件
 */
<template>
  <div>
    <Modal v-model="historyModal" width="800" :mask-closable="false" :closable="false">
      <div slot="header">
        <div class="heade">
          <strong>{{$t('title.history')}}</strong>
          <Icon type="close-round" @click="cancel"></Icon>
        </div>
      </div>

      <div>
        <Table :columns="fileTableCol" :data="fileTableData"></Table>
        <div class="page">
          <Page :total="pageTotal" show-elevator show-sizer show-total size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        </div>
      </div>
      <p slot="footer">
        <Button type="ghost" @click="cancel">{{$t('operation.close')}}</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { ApiGetFileDown } from "@/api/manage/down-center-api";
import { onlineViewType } from "common/js/code";
import moment from "moment";
export default {
  data() {
    return {
      fileTableCol: [
        {
          key: "fileName",
          title: this.$t("file.name"),
          minWidth: 200
        },
        {
          key: "fileType",
          title: this.$t("title.format"),
          align: "center"
        },
        {
          key: "versionNo",
          title: this.$t("file.versionNo"),
          align: "center"
        },
        {
          key: "",
          title: this.$t("title.view"),
          align: "center",
          render: (h, params) => {
            if (onlineViewType.includes(params.row.fileType)) {
              return h(
                "div",
                {
                  style: {
                    cursor: "pointer",
                    padding: "5px 0"
                  },
                  on: {
                    click: () => {
                      const { href } = this.$router.resolve({
                        path: `/pdf/${params.row.fileId}/${
                          params.row.fileVersionId
                        }`,
                        query: {
                          type: "history" //标记为历史版本查看
                        }
                      });
                      window.open(href, "_blank");
                    }
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "eye",
                      size: 20
                    }
                  })
                ]
              );
            } else {
              return h("div", "--");
            }
          }
        },
        {
          key: "fileStatus",
          title: this.$t("operation.down"),
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer",
                  padding: "5px 0"
                },
                on: {
                  click: e => {
                    this.siginFileDown(params.row);
                  }
                }
              },
              [
                h("Icon", {
                  props: {
                    type: "android-download",
                    size: 16
                  }
                })
              ]
            );
          }
        }
      ],

      fileListParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },

  methods: {
    //分页
    pageChange(value) {
      this.$store.commit("getHistoryData", {
        vm: this,
        data: { pageNum: value }
      });
    },
    pageSizeChange(value) {
      this.$store.commit("getHistoryData", {
        vm: this,
        data: { pageSize: value }
      });
    },
    cancel() {
      this.$store.commit("historyModalToggle", false);
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
  computed: {
    historyModal() {
      return this.$store.state.docDocument.history.modal;
    },
    fileTableData() {
      return this.$store.state.docDocument.history.tableData;
    },
    pageTotal() {
      return this.$store.state.docDocument.history.pageTotal;
    }
  }
};
</script>

<style lang="scss" scoped>
.heade {
  display: flex;
  justify-content: space-between;
  padding: 5px 16px;
  color: #1c2438;
}
</style>

