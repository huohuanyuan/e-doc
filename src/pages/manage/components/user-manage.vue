/*
 * @Author: chengshanshan 
 * @Date: 2018-07-25 10:15:38 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-06 17:46:24
 */

<template>
  <div class="user-wrapper" ref="outWrapper">
    <div ref="topWrapper">
      <ul class="top">
        <li v-if="privileges.new" @click="modelShow(true)">
          <Icon type="plus-round" size="15"></Icon>{{$t('title.addUser')}}</li>
        <li v-if="privileges.modify && showBtns.modify" @click="modelShow(false)">
          <Icon type="compose" size="15"></Icon>{{$t('operation.edit')}}</li>
        <li v-if="privileges.delete  && showBtns.delete" @click="deleteShow">
          <Icon type="trash-a" size="15"></Icon>{{$t('operation.doDelete')}}</li>
      </ul>
      <split></split>
    </div>
    <Table highlight-row :height="tableHeight" :columns="userTableCol" :data="userTableData" @on-sort-change="sortChange" @on-current-change="selectRow"></Table>
    <div class="page" ref="bottomWrapper">
      <Page :total="pageTotal" show-elevator show-sizer show-total size="small" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
    </div>
    <!-- 新建用户modal start-->
    <Modal v-model="userModel" :mask-closable="false" width="800">
      <p slot="header" style="text-align:center">
        <span v-if="modelType">{{$t('title.addUser')}}</span>
        <span v-else>{{$t('title.editUser')}}</span>
      </p>
      <div>
        <split></split>
        <Form ref="userForm" :model="userForm" :rules="userFormRule" :label-width="80">
          <Row>
            <Col span="11">
            <FormItem :label="$t('title.userName')" prop="username">
              <Input v-model.trim="userForm.username"></Input>
            </FormItem>
            </Col>
            <Col span="11">
            <FormItem :label="$t('title.email')" prop="email">
              <Input v-model.trim="userForm.email" :disabled="!modelType"></Input>
            </FormItem>
            </Col>
            <Col span="2"></Col>
          </Row>
        </Form>
        <Form ref="siteRoleForm" :model="siteRoleForm" :rules="siteRoleRule" :label-width="80">
          <Row>
            <Col span="11">
            <FormItem :label="$t('title.site')" prop="siteId">
              <Select v-model="siteRoleForm.siteId" @on-change="siteChange">
                <Option v-for="item in siteList" :value="item.siteId" :key="item.siteId">{{item.siteName}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="11">
            <FormItem :label="$t('title.role')" prop="roleId">
              <Select v-model="siteRoleForm.roleId">
                <Option v-for="item in roleList" :value="item.roleId" :disabled="item.disabled" :key="item.roleId">{{item.roleName}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="2">
            <div class="add-btn">
              <Button type="dashed" size="small" icon="plus" @click="siteRoleSave('siteRoleForm')">{{$t('operation.sure')}}</Button>

            </div>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col span="24">
          <div class="tag-wrapper" v-show="siteRoleList.length>0">
            <Tag v-for="(item,index) in siteRoleList" :key="index" :name="item.tagName" closable @on-close="deleteTag">{{item.siteName}}--{{item.roleName}}</Tag>
          </div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button v-if="modelType" type="primary" long :loading="newLoading" @click="newSave('userForm')">{{$t('operation.sure')}}</Button>
        <Button v-else type="primary" long :loading="modifyLoading" @click="modifySave('userForm')">{{$t('operation.sure')}}</Button>
      </div>
    </Modal>
    <!-- 新建用户modal end -->
    <Modal v-model="deleteModel" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{$t('operation.delete')}}</span>
      </p>
      <div style="padding:0 10px">
        <p>{{$t('title.deleteUserInfo',{username:currentRow.username})}}</p>
        <split></split>
        <RadioGroup v-model="selectAdminId">
          <Radio v-for="item in adminList" :label="item.userId" :key="item.userId">
            <span>{{item.username}}</span>
          </Radio>
        </RadioGroup>
      </div>
      <div slot="footer">
        <Button type="error" long :loading="deleteLoading" @click="deleleSave">{{$t('operation.doDelete')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  ApiGetUserList,
  ApiGetSiteList,
  ApiGetRoleList,
  ApiPostUser,
  ApiPutUser,
  ApiGetAdminList,
  ApiDeleteUser
} from "@/api/manage/user-manage-api";
import { resCode } from "common/js/code";
import { taskExist } from "common/js/common";
import Split from "components/units/split";
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
      modelType: true, //模态框类型：新建true 修改false
      siteRoleList: [],
      userTableCol: [
        {
          key: "username",
          title: this.$t("title.userName"),
          sortable: "custom",
          maxWidth: 150
        },
        {
          key: "email",
          title: this.$t("title.email"),
          maxWidth: 300
        },
        {
          key: "siteRole",
          title: this.$t("title.roleAndPrivlege"),
          render: (h, params) => {
            let _arr = [];
            for (let [k,site] of params.row.siteList.entries()) {
              for (let[j,role] of site.roleList.entries()) {
                _arr.push(h("Tag", `${site.siteName}--${role.roleName}`));
              }
            }
            return h("div", _arr);
          }
        }
      ],
      userTableData: [],
      pageTotal: 0,
      tableHeight: 100,
      userTableParams: {
        pageNum: 1,
        pageSize: 10,
        sortKey: "",
        order: ""
      },
      siteList: [],
      roleList: [],
      userModel: false,
      newLoading: false,
      modifyLoading: false,
      userForm: {
        username: "",
        email: ""
      },
      userFormRule: {
        username: [
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
        ],
        email: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.lengthValidate",{number:64}),
            max: 64,
            trigger: "blur"
          }
        ]
      },
      //机构-角色选择表单验证
      siteRoleForm: {
        siteId: "",
        roleId: ""
      },
      siteRoleRule: {
        siteId: [
          {
            required: true,
            message: " "
          }
        ],
        roleId: [
          {
            required: true,
            message: " "
          }
        ]
      },

      //删除机构
      deleteModel: false,
      deleteLoading: false,
      currentRow: {},
      adminList: [],
      selectAdminId: ""
    };
  },
  methods: {
    init() {
      this.getUserList();
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
    getUserList() {
      ApiGetUserList(this.userTableParams).then(res => {
        if (res.code == "success") {
          this.userTableData = res.data;
          this.pageTotal = res.total;
        } else {
          if (resCode[res.code]) {
            this.$Message.error(resCode[res.code]);
          }
        }
      });
    },
    //排序
    sortChange(params) {
      this.userTableParams.sortKey = params.key;
      this.userTableParams.order = params.order;
      this.getUserList();
    },
    //分页
    pageChange(value) {
      this.userTableParams.pageNum = value;
      this.getUserList();
    },
    pageSizeChange(value) {
      this.userTableParams.pageSize = value;
      this.getUserList();
    },
    //选中行
    selectRow(selection) {
      this.currentRow = selection;
      this.showBtns.modify = true;
      this.showBtns.delete = true;
      this.userForm.username = selection.username;
      this.userForm.email = selection.email;
      //给siteRoleList赋值
      this.siteRoleList = [];
      for (let [k,site] of selection.siteList.entries()) {
        for (let [j,role] of site.roleList.entries()) {
          this.siteRoleList.push({
            siteId: site.siteId,
            siteName: site.siteName,
            roleId: role.roleId,
            roleName: role.roleName,
            tagName: `${site.siteId}-${role.roleId}`,
            userId: selection.userId
          });
        }
      }
    },
    //获取sitelist
    getSiteList() {
      ApiGetSiteList().then(res => {
        if (res.code == "success") {
          this.siteList = res.data;
          this.siteList = [
            { siteId: 0, siteName: this.$t("title.all") },
            ...this.siteList
          ];
        }
      });
    },
    //获取rolelist
    getRoleList() {
      ApiGetRoleList().then(res => {
        if (res.code == "success") {
          this.roleList = res.data;
        }
      });
    },
    siteChange(value) {
      //如果选择全部site 则删除“项目管理员选项"
      if (value == 0) {
        //全部siteid：0 项目管理员roleId：9
        for (let [index, elem] of this.roleList.entries()) {
          if (elem.roleId == 9) {
            elem.disabled = false;
            break;
          }
        }
      } else {
        for (let [index, elem] of this.roleList.entries()) {
          if (elem.roleId == 9) {
            elem.disabled = true;
            break;
          }
        }
        if (this.siteRoleForm.roleId == 9) {
          this.siteRoleForm.roleId = "";
        }
      }
    },
    //添加一行
    siteRoleSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          //过滤掉重复的值
          let _tagName = `${this.siteRoleForm.siteId}-${
            this.siteRoleForm.roleId
          }`;
          this.siteRoleList = this.siteRoleList.filter(
            (currentVal, index, arr) => {
              return _tagName != currentVal.tagName;
            }
          );
          //push新值
          this.siteRoleList.push({
            siteId: this.siteRoleForm.siteId,
            siteName: this.siteMap.get(this.siteRoleForm.siteId),
            roleId: this.siteRoleForm.roleId,
            roleName: this.roleMap.get(this.siteRoleForm.roleId),
            tagName: `${this.siteRoleForm.siteId}-${this.siteRoleForm.roleId}`
          });
        }
      });
    },
    //删除机构角色
    deleteTag(event, name) {
      //name：siteId-roleId
      this.siteRoleList = this.siteRoleList.filter((currentVal, index, arr) => {
        return name != currentVal.tagName;
      });
    },

    modelShow(type) {
      this.modelType = type;
      this.userModel = true;
      this.getSiteList();
      this.getRoleList();
      if (this.modelType) {
        //新建
        this.userForm.username = "";
        this.userForm.email = "";
        this.siteRoleList = [];
        this.$refs["userForm"].resetFields();
        this.$refs["siteRoleForm"].resetFields();
      }
    },
    //新建用户保存
    newSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.siteRoleList.length > 0) {
            this.newLoading = true;
            ApiPostUser({
              username: this.userForm.username,
              email: this.userForm.email,
              userRoleSSList: this.siteRoleList
            }).then(res => {
              this.newLoading = false;
              if (res.code == "success") {
                this.userModel = false;
                this.getUserList();
              } else {
                this.$Message.error(resCode(this, res.code));
              }
            });
          } else {
            this.$Message.error(this.$t("note.addSitePrivilege"));
          }
        }
      });
    },
    //修改用户保存
    modifySave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.siteRoleList.length > 0) {
            this.modifyLoading = true;
            ApiPutUser({
              userId: this.currentRow.userId,
              username: this.userForm.username,
              email: this.userForm.email,
              userRoleSSList: this.siteRoleList
            }).then(res => {
              this.modifyLoading = false;
              if (res.code == "success") {
                this.userModel = false;
                this.getUserList();
              } else if (res.code == "task_exist") {
                taskExist(this, res.data);
              } else {
                this.$Message.error(resCode(this, res.code));
              }
            });
          } else {
            this.$Message.error(this.$t("note.addSitePrivilege"));
          }
        }
      });
    },
    deleteShow() {
      this.deleteModel = true;
      this.getAdminList();
    },
    //删除用户保存
    deleleSave() {
      this.deleteLoading = true;
      ApiDeleteUser({
        userId: this.currentRow.userId,
        studyManagerId: this.selectAdminId
      }).then(res => {
        this.deleteLoading = false;
        if (res.code == "success") {
          this.deleteModel = false;
          this.getUserList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //获取管理员列表
    getAdminList() {
      ApiGetAdminList().then(res => {
        if (res.code == "success") {
          this.adminList = res.data;
          this.selectAdminId = this.adminList[0].userId;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    }
  },
  computed: {
    siteMap() {
      //保存siteid 和 siteName的对应关系，用于tag显示
      let _siteMap = new Map();
      for (let [index, elem]of this.siteList.entries()) {
        _siteMap.set(elem.siteId, elem.siteName);
      }
      return _siteMap;
    },
    roleMap() {
      let _roleMap = new Map();
      for (let[index, elem] of this.roleList.entries()) {
        _roleMap.set(elem.roleId, elem.roleName);
      }
      return _roleMap;
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
.user-wrapper {
  height: 100%;
  .top {
    @include btnGroup();
  }
}
.tag-wrapper {
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 0 10px;
}
.add-btn {
  padding: 4px;
}
</style>


