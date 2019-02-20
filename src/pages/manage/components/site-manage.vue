/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 10:15:38 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-05 17:14:34
 */

<template>
  <div class="site-wrapper" ref="outWrapper">
    <div ref="topWrapper">
      <ul class="top">
        <li v-if="privileges.new" @click="newShow('newForm')">
          <Icon type="plus-round" size="15"></Icon>{{$t('operation.add')}}</li>
        <li v-if="privileges.modify && showBtns.modify" @click="modifyShow('modifyForm')">
          <Icon type="compose" size="15"></Icon>{{$t('operation.edit')}}</li>
        <li v-if="privileges.delete  && showBtns.delete" @click="deleteShow">
          <Icon type="trash-a" size="15"></Icon>{{$t('operation.doDelete')}}</li>
      </ul>
      <split></split>
    </div>
    <Table highlight-row :height="tableHeight" :columns="siteTableCol" :data="siteTableData" @on-sort-change="sortChange" @on-current-change="selectRow"></Table>
    <div class="page" ref="bottomWrapper">
      <Page :total="pageTotal" show-elevator show-sizer show-total size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
    </div>
    <!-- 新建机构modal -->
    <Modal v-model="newModel" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>{{$t('title.addSite')}}</span>
      </p>
      <div>
        <split></split>
        <Form ref="newForm" :model="newForm" :rules="newFormRule" :label-width="80">
          <FormItem :label="$t('title.siteName')" prop="siteName">
            <Input v-model.trim="newForm.siteName"></Input>
          </FormItem>
          <FormItem :label="$t('title.siteSName')"  prop="siteShortName">
            <Input v-model.trim="newForm.siteShortName"></Input>
          </FormItem>
          <FormItem :label="$t('title.siteCode')"  prop="siteNumber">
            <Input v-model.trim="newForm.siteNumber"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" long :loading="newLoading" @click="newSave('newForm')">{{$t('operation.save')}}</Button>
      </div>
    </Modal>
    <!-- 修改机构modal -->
    <Modal v-model="modifyModel" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>{{$t('title.editSite')}}</span>
      </p>
      <div>
        <split></split>
        <Form ref="modifyForm" :model="modifyForm" :rules="modifyFormRule" :label-width="80">
          <FormItem :label="$t('title.siteName')" prop="siteName">
            <Input v-model.trim="modifyForm.siteName"></Input>
          </FormItem>
          <FormItem :label="$t('title.siteSName')"  prop="siteShortName">
            <Input v-model.trim="modifyForm.siteShortName"></Input>
          </FormItem>
          <FormItem :label="$t('title.siteCode')" prop="siteNumber">
            <Input v-model.trim="modifyForm.siteNumber"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" long :loading="newLoading" @click="modifySave('modifyForm')">{{$t('operation.save')}}</Button>
      </div>

    </Modal>
    <Modal v-model="deleteModel" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{$t('operation.delete')}}</span>
      </p>
      <div style="text-align:center">
        <p v-html="$t('operation.deleteNoRecover',{name:currentRow.siteName})"></p>
      </div>
      <div slot="footer">
        <Button type="error" long :loading="deleteLoading" @click="deleleSave">{{$t('operation.doDelete')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  ApiGetSiteList,
  ApiPostSite,
  ApiPutSite,
  ApiDeleteSite
} from "@/api/manage/site-manage-api";
import { resCode } from "common/js/code";
import Split from "components/units/split";
import moment from "moment";
export default {
  components: {
    Split
  },
  data() {
    return {
      //权限
      privileges: {
        new: true,
        modify: true,
        delete: true
      },
      //只有选择一行时才显示修改或删除按钮
      showBtns: {
        new: true,
        modify: false,
        delete: false
      },
      //新增机构
      newModel: false,
      newLoading: false,
      newForm: {
        siteName: "",
        siteShortName: "",
        siteNumber: ""
      },
      newFormRule: {
        siteName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:60}),
            max: 60,
            trigger: "blur"
          }
        ],
        siteShortName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:20}),
            max: 20,
            trigger: "blur"
          }
        ],
        siteNumber: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:30}),
            max: 30,
            trigger: "blur"
          }
        ]
      },
      //修改机构
      modifyModel: false,
      modifyLoading: false,
      modifyForm: {
        siteName: "",
        siteShortName: "",
        siteNumber: ""
      },
      modifyFormRule: {
        siteName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:60}),
            max: 60,
            trigger: "blur"
          }
        ],
        siteShortName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:20}),
            max: 20,
            trigger: "blur"
          }
        ],
        siteNumber: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:30}),
            max: 30,
            trigger: "blur"
          }
        ]
      },
      //删除机构
      deleteModel: false,
      deleteLoading: false,
      //当前选中行数据
      currentRow: {},
      //机构列表
      siteTableCol: [
        {
          key: "siteName",
          title: this.$t('title.siteName'),
          sortable: "custom"
        },
        {
          key: "siteShortName",
          title: this.$t('title.siteSName'),
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                if (params.row.siteShortName) {
                  return params.row.siteShortName;
                } else {
                  return "--";
                }
              })(this)
            );
          }
        },
        {
          key: "siteNumber",
          title: this.$t('title.siteCode'),
          align: "center"
        },
        {
          key: "createdTime",
          title: this.$t('file.createTime'),
          align: "center",
          sortable: "custom",
          render: (h, params) => {
            return h(
              "div",
              params.row.createdTime
                ? moment(params.row.createdTime).format("YYYY-MM-DD HH:mm:ss")
                : "--"
            );
          }
        }
      ],
      siteTableData: [],
      pageTotal: 0,
      tableHeight: 100,
      siteListParams: {
        pageNum: 1,
        pageSize: 10,
        sortKey: "",
        order: ""
      }
    };
  },
  methods: {
    init() {
      this.getSiteList();
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
    getSiteList() {
      ApiGetSiteList(this.siteListParams).then(res => {
        if (res.code == "success") {
          this.siteTableData = res.data;
          this.pageTotal = res.total;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //排序
    sortChange(params) {
      this.siteListParams.sortKey = params.key;
      this.siteListParams.order = params.order;
      this.getSiteList();
    },
    //分页
    pageChange(value) {
      this.siteListParams.pageNum = value;
      this.getSiteList();
    },
    pageSizeChange(value) {
      this.siteListParams.pageSize = value;
      this.getSiteList();
    },
    //选中行
    selectRow(selection) {
      this.showBtns.modify = true;
      this.showBtns.delete = true;
      this.currentRow = selection;
    },
    //新建
    newShow(name) {
      this.newModel = true;
      this.$refs[name].resetFields();
    },
    //新建机构保存
    newSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.newLoading = true;
          ApiPostSite(this.newForm).then(res => {
            this.newLoading = false;
            if (res.code == "success") {
              this.newModel = false;
              this.getSiteList();
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    //修改
    modifyShow(name) {
      this.modifyModel = true;
      this.$refs[name].resetFields();
      this.modifyForm.siteId = this.currentRow.siteId;
      this.modifyForm.siteName = this.currentRow.siteName;
      this.modifyForm.siteShortName = this.currentRow.siteShortName;
      this.modifyForm.siteNumber = this.currentRow.siteNumber;
    },
    //修改机构保存
    modifySave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modifyLoading = true;
          ApiPutSite(this.modifyForm).then(res => {
            this.modifyLoading = false;
            if (res.code == "success") {
              this.modifyModel = false;
              this.getSiteList();
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    deleteShow() {
      this.deleteModel = true;
    },
    //删除机构保存
    deleleSave() {
      this.deleteLoading = true;
      ApiDeleteSite(this.currentRow.siteId).then(res => {
        this.deleteLoading = false;
        if (res.code == "success") {
          //如果当前表格数据只有一条，则请求上一页
          if (this.siteTableData.length == 1) {
            this.siteListParams.pageNum =
              this.siteListParams.pageNum > 1
                ? --this.siteListParams.pageNum
                : 1;
          }
          this.deleteModel = false;
          this.getSiteList();
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
.site-wrapper {
  height: 100%;
  .top {
    @include btnGroup();
  }
}
</style>
