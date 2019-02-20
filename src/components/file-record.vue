/*
 * @Author: chengshanshan 
 * @Date: 2018-07-26 11:44:42 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-05 11:00:18
 * @instraction:文件操作记录list
 */
<template>
  <div>
    <Modal v-model="recordModal" width="800" :mask-closable="false" :closable="false">
      <div slot="header">
        <div class="heade">
          <strong>{{$t('title.record')}}</strong>

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
import moment from "moment";
export default {
  data() {
    return {
      fileTableCol: [
        {
          key: "updatedTime",
          title: this.$t("file.updateTime"),
          maxWidth: 180,
          render: (h, params) => {
            return h(
              "div",
              moment(params.row.auditTime).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          key: "auditText",
          title: this.$t("file.operationDetails"),
          render:(h,params) => {
            return h("div",`${params.row.username}:${params.row.auditText}`)
          }
         }
      ]
    };
  },
  computed: {
    recordModal() {
      return this.$store.state.docDocument.record.modal;
    },
    fileTableData() {
      return this.$store.state.docDocument.record.tableData;
    },
    pageTotal() {
      return this.$store.state.docDocument.record.pageTotal;
    }
  },
  methods: {
    //分页
    pageChange(value) {
      this.$store.commit("getRecordData", { 
        vm: this,
        data: { pageNum: value }
      });
    },
    pageSizeChange(value) {
      this.$store.commit("getRecordData", { 
        vm: this,
        data: { pageSize: value }
      });
    },
    cancel() {
      this.$store.commit("recordModalToggle", false);
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
