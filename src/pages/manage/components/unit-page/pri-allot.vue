/*
 * @Author: chengshanshan 
 * @Date: 2018-07-31 17:10:21 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-06 17:44:36
 * @instraction：个人权限分配
 */

<template>
  <div class="pri-wrapper" ref="outWrapper">
    <div ref="topWrapper">
      <!-- <ul class="top">
        <li @click="priModelShow(true)">
          <Icon type="plus-round" size="15"></Icon>分配角色
        </li>
        <li v-if="privileges.modify && showBtns.modify" @click="priModelShow(false)">
          <Icon type="compose" size="15"></Icon>修改</li>
        <li v-if="privileges.delete  && showBtns.delete" @click="deleteShow">
          <Icon type="trash-a" size="15"></Icon>删除</li>
        <li @click="routerGo">
          <Icon type="ios-arrow-thin-left"></Icon>返回权限配置
        </li>
      </ul> -->
      <ul class="top">
        <li v-for="(item,index) of childrenRouter">
          <router-link class="btn" :to="{name:item.priv}" :key="index">{{pageCode[item.priv]}}</router-link>
        </li>
        <li @click="priModelShow(true)">
          <Icon type="plus-round" size="15"></Icon>{{$t('title.SetPrivilege')}}
        </li>
        <li v-if="privileges.modify && showBtns.modify" @click="priModelShow(false)">
          <Icon type="compose" size="15"></Icon>{{$t('operation.edit')}}</li>
        <li v-if="privileges.delete  && showBtns.delete" @click="deleteShow">
          <Icon type="trash-a" size="15"></Icon>{{$t('operation.doDelete')}}</li>
      </ul>
      <split></split>
    </div>
    <Table highlight-row :height="tableHeight" :columns="priTableCol" :data="priTableData" @on-current-change="selectRow"></Table>
    <div class="page" ref="bottomWrapper">
      <!-- <Page :total="pageTotal" show-elevator show-sizer show-total size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page> -->
    </div>
    <!-- 添加权限 -->
    <Modal v-model="privilegeModel" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span v-if="modelType">{{$t('title.privilegeSet')}}</span>
        <span v-else>{{$t('title.editPrivilege')}}</span>
      </p>
      <div>
        <split></split>
        <Form ref="privilegeForm" :model="privilegeForm" :rules="privilegeFormRule" :label-width="80">
          <FormItem :label="$t('title.user')" prop="userId">
            <Select @on-change="userChange" v-model="privilegeForm.userId" v-if="modelType">
              <Option v-for="item in userList" :value="item.userId" :key="item.userId">{{ item.username }}</Option>
            </Select>
            <Select v-model="privilegeForm.userId" v-else disabled>
              <Option :value="currentRow.userId">{{ currentRow.username }}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('title.site')" prop="siteId">
            <Select v-model="privilegeForm.siteId" v-if="modelType">
              <Option v-for="item in siteList" :value="item.siteId" :key="item.value">{{ item.siteName }}</Option>
            </Select>
            <Select v-model="privilegeForm.siteId" v-else disabled>
              <Option :value="currentRow.siteId">{{ currentRow.siteName }}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('title.privilege')" prop="privilegeList">
            <Select multiple v-model="privilegeForm.privilegeList">
              <Option v-for="item in priList" :value="item.privilegeId" :key="item.privilegeId">{{ item.privilegeName }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button v-if="modelType" type="primary" long :loading="newLoading" @click="newSave('privilegeForm')">{{$t('operation.save')}}</Button>
        <Button v-else type="primary" long :loading="modifyLoading" @click="modifySave('privilegeForm')">{{$t('operation.save')}}</Button>
      </div>
    </Modal>

    <!-- 删除角色 -->
    <Modal v-model="deleteModel" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{$t('operation.delete')}}</span>
      </p>
      <div style="padding:0 10px">
        <p>{{$t('title.deleteUserPrivilege',{username:currentRow.username})}}</p>
        <split></split>
        <div>
          <Tag v-for="item in currentRow.privilegeList" :key="item.privilegeId">{{item.privilegeName}}</Tag>
        </div>
      </div>
      <div slot="footer">
        <Button type="error" long :loading="deleteLoading" @click="deleleSave">{{$t('operation.doDelete')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  ApiGetUserPriList,
  ApiGetUserSiteList,
  ApiGetPriList,
  ApiPostUserPri,
  ApiPutUserPri,
  ApiDeleteUserPri
} from "@/api/manage/pri-manage-api";
import { resCode } from "common/js/code";
import { taskExist } from "common/js/common";
import Split from "components/units/split";
import DocSwitch from "components/units/doc-switch";
export default {
  components: {
    Split,
    DocSwitch
  },
  data() {
    return {
      pageCode: {
        privRoleManage: this.$t("title.privilegeSet"),
        privUserManage: this.$t("title.SetPrivilege")
      },
      childrenRouter: [], //子路由列表
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

      priTableData: [],
      tableHeight: 100,
      priTableCol: [
        { key: "username", maxWidth: 150, title: this.$t("title.user") },
        {
          key: "siteName",
          minWidth: 150,
          maxWidth: 300,
          title: this.$t("title.site")
        },
        {
          key: "privilegeList",
          title: this.$t("title.privilege"),
          render: (h, params) => {
            let _arr = [];
            for (let [index, elem] of params.row.privilegeList.entries()) {
              _arr.push(h("Tag", elem.privilegeName));
            }
            return h("div", _arr);
          }
        }
      ],
      pageTotal: 0,
      currentRow: {}, //修改或删除的角色数据
      userList: [], //保存user-site list
      siteList: [],
      priList: [], //权限list
      privilegeModel: false, //新建/修改model框
      modelType: true, //标记model框类型，新建true 修改false
      privilegeForm: {
        userId: "",
        siteId: "",
        privilegeList: []
      },
      privilegeFormRule: {
        userId: [
          {
            required: true,
            message: " "
          }
        ],
        siteId: [
          {
            required: true,
            message: " "
          }
        ],
        privilegeList: [
          {
            required: true,
            message: " "
          }
        ]
      },

      newLoading: false,
      modifyLoading: false,
      deleteLoading: false,
      priLoading: false,
      deleteModel: false
    };
  },
  methods: {
    init() {
      this.getPrivilegeList();
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
    getPrivilegeList() {
      ApiGetUserPriList().then(res => {
        if (res.code == "success") {
          this.priTableData = res.data;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //获取userlist
    getUserSiteList() {
      ApiGetUserSiteList().then(res => {
        if (res.code == "success") {
          this.userList = res.data;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    userChange(value) {
      this.siteList = [];
      for (let [index, elem] of this.userList.entries()) {
        if (elem.userId == value) {
          this.siteList = elem.siteSet;
          this.privilegeForm.siteId = this.siteList[0].siteId;
          break;
        }
      }
    },
    //获取权限list
    getPriList() {
      ApiGetPriList().then(res => {
        if (res.code == "success") {
          this.priList = res.data;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    priModelShow(type) {
      this.modelType = type;
      this.getUserSiteList();
      this.getPriList();
      if (this.modelType) {
        //新建
        this.privilegeForm.userId = "";
        this.privilegeForm.siteId = "";
        this.privilegeForm.privilegeList = [];
        this.$refs["privilegeForm"].resetFields();
      } else {
        //修改
        this.siteList = [];
        for (let [index, elem] of this.userList.entries()) {
          if (elem.userId == this.currentRow.userId) {
            this.siteList = elem.siteSet;
            break;
          }
        }
      }
      this.privilegeModel = true;
    },
    //新增角色保存
    newSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.newLoading = true;
          let _priList = [];
          for (let [index, elem] of this.privilegeForm.privilegeList.entries()) {
            _priList.push({ privilegeId: elem });
          }
          ApiPostUserPri({
            userId: this.privilegeForm.userId,
            siteId: this.privilegeForm.siteId,
            privilegeList: _priList
          }).then(res => {
            this.newLoading = false;
            if (res.code == "success") {
              this.privilegeModel = false;
              this.getPrivilegeList();
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    selectRow(selection) {
      this.currentRow = selection;
      this.showBtns.modify = true;
      this.showBtns.delete = true;
      this.privilegeForm.userId = this.currentRow.userId;
      this.privilegeForm.siteId = this.currentRow.siteId;
      this.privilegeForm.privilegeList = [];
      for (let [index, elem] of this.currentRow.privilegeList.entries()) {
        this.privilegeForm.privilegeList.push(elem.privilegeId);
      }
    },
    //修改角色保存
    modifySave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modifyLoading = true;
          let _priList = [];
          for (let [index, elem] of this.privilegeForm.privilegeList.entries()) {
            _priList.push({ privilegeId: elem });
          }
          ApiPutUserPri({
            userId: this.privilegeForm.userId,
            siteId: this.privilegeForm.siteId,
            privilegeList: _priList
          }).then(res => {
            this.modifyLoading = false;
            if (res.code == "success") {
              this.privilegeModel = false;
              this.getPrivilegeList();
            } else if (res.code == "task_exist") {
              taskExist(this, res.data);
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    //删除角色
    deleteShow() {
      this.deleteModel = true;
    },
    //删除角色保存
    deleleSave() {
      this.deleteLoading = true;
      ApiDeleteUserPri({
        siteId: this.currentRow.siteId,
        userId: this.currentRow.userId
      }).then(res => {
        this.deleteLoading = false;
        if (res.code == "success") {
          this.getPrivilegeList();
          this.deleteModel = false;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },

    routerGo() {
      this.$router.push({ name: "priConfig" });
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
    this.computeHeight();
    let currentPageList = this.menuList.filter((currentVal, index) => {
      return currentVal.priv == this.$route.meta.parent;
    });

    this.childrenRouter = currentPageList[0].children;
  },
  updated() {
    this.computeHeight();
  }
};
</script>
<style lang="scss" scoped>
@import "../../../../common/css/mixin.scss";
.pri-wrapper {
  height: 100%;
  .top {
    @include btnGroup();
    a {
      color: $font-light-color;
      &.router-link-active {
        color: $theme-blue;
      }
    }
  }
}
</style>

