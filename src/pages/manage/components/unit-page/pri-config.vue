/*
 * @Author: chengshanshan 
 * @Date: 2018-07-31 17:10:21 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-06 17:45:22
 * @instraction：系统权限配置
 */
 
<template>
  <div class="pri-wrapper" ref="outWrapper">
    <div ref="topWrapper">
      <ul class="top">
        <li v-for="(item,index) of childrenRouter">
          <router-link class="btn" :to="{name:item.priv}" :key="index">{{pageCode[item.priv]}}</router-link>
        </li>
        <li @click="newShow('newForm')">
          <Icon type="plus-round" size="15"></Icon>{{$t('title.addRole')}}</li>
      </ul>
      <split></split>
    </div>
    <Table :loading="tableLoading" :height="tableHeight" :columns="priTableCol" :data="priTableData"></Table>
    <div class="page" ref="bottomWrapper">
      <Button @click="showIntro">{{$t('title.checkPrivilegeInfo')}}</Button>
      <Button @click="saveRolePri" :loading="priLoading" type="success">{{$t('operation.save')}}</Button>
    </div>
    <!-- 添加权限 -->
    <Modal v-model="newModel" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>{{$t('title.addRole')}}</span>
      </p>
      <div>
        <split></split>
        <Form ref="newForm" :model="newForm" :rules="newFormRule" :label-width="80">
          <FormItem :label="$t('title.roleName')" prop="roleName">
            <Input v-model.trim="newForm.roleName"></Input>
          </FormItem>
          <FormItem :label="$t('title.roleInfo')" prop="description">
            <Input v-model.trim="newForm.description" type="textarea"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" long :loading="newLoading" @click="newSave('newForm')">{{$t('operation.save')}}</Button>
      </div>
    </Modal>
    <!-- 修改权限 -->
    <Modal v-model="modifyModel" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>{{$t('title.editRole')}}</span>
      </p>
      <div>
        <split></split>
        <Form ref="modifyForm" :model="modifyForm" :rules="modifyFormRule" :label-width="80">
          <FormItem :label="$t('title.roleName')" prop="roleName">
            <Input v-model.trim="modifyForm.roleName"></Input>
          </FormItem>
          <FormItem :label="$t('title.roleInfo')" prop="description">
            <Input v-model.trim="modifyForm.description" type="textarea"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" long :loading="modifyLoading" @click="modifySave('modifyForm')">{{$t('operation.save')}}</Button>
      </div>
    </Modal>
    <!-- 删除角色 -->
    <Modal v-model="deleteModel" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>{{$t('operation.delete')}}</span>
      </p>
      <div style="text-align:center">
        <p v-html="$t('operation.deleteNoRecover',{name:currentRole.roleName})"></p>
      </div>
      <div slot="footer">
        <Button type="error" long :loading="deleteLoading" @click="deleleSave">{{$t('operation.doDelete')}}</Button>
      </div>
    </Modal>
    <!-- 权限和角色介绍 -->
    <Modal v-model="introModel" :mask-closable="false" :width="800">
      <p slot="header" style="text-align:center">
        <span>{{$t('title.roleAndPrivilegeInfo')}}</span>
      </p>
      <!-- 角色介绍 -->
      <Table size="small" :columns="roleIntroCol" :data="roleIntroData" :show-header="false">
        <p slot="header" style="text-align:center">{{$t('title.roleInfo')}}</p>
      </Table>
      <!-- 权限介绍 -->
      <Table size="small" :columns="priIntroCol" :data="priIntroData" :show-header="false">
        <p slot="header" style="text-align:center">{{$t('title.privilegeInfo')}}</p>
      </Table>
      <p slot="footer">
        <Button type="ghost" @click="introModel=false">{{$t('operation.close')}}</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import {
  ApiGetPrivilegeList,
  ApiPostRole,
  ApiPutRole,
  ApiDeleteRole,
  ApiPutPriAndRole
} from "@/api/manage/pri-manage-api";
import { resCode } from "common/js/code";
import { taskExist } from "common/js/common";
import Split from "components/units/split";
import DocSwitch from "components/units/doc-switch";
import moment from "moment";
import qs from "qs";
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
      roleList: [],
      priTableData: [],
      tableHeight: 100,
      tableLoading: true,
      currentRole: {}, //修改或删除的角色数据
      //新增角色
      newModel: false,
      newLoading: false,
      newForm: {
        roleName: "",
        description: ""
      },
      newFormRule: {
        roleName: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message:  this.$t("note.lengthValidate",{number:64}),
            max: 64,
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message:  this.$t("note.lengthValidate",{number:128}),
            max: 128,
            trigger: "blur"
          }
        ]
      },
      //修改角色
      modifyModel: false,
      modifyLoading: false,
      modifyForm: {
        roleName: "",
        description: ""
      },
      modifyFormRule: {
        roleName: [
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
        ],
        description: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            type: "string",
            message: this.$t("note.length128"),
            max: 128,
            trigger: "blur"
          }
        ]
      },
      //删除角色
      deleteModel: false,
      deleteLoading: false,
      //权限说明
      introModel: false,
      roleIntroCol: [
        {
          key: "roleName"
        },
        {
          key: "description"
        }
      ],
      priIntroCol: [
        {
          key: "privilegeName"
        },
        {
          key: "description"
        }
      ],
      roleIntroData: [],
      priIntroData: [], //权限说明
      priLoading: false,
      editRolePriData: new Map() //权限配置数据保存
    };
  },
  computed: {
    //table列
    priTableCol: function(params) {
      const priRaido = (vm, h, params) => {
        return h(DocSwitch, {
          props: {
            size: "small",
            value: (function() {
              if (params.row.roles.includes(params.column.key)) {
                return true;
              } else {
                return false;
              }
            })(params)
          },
          on: {
            "on-change": value => {
              //保存修改权限的数据
              let _rolePri = `${params.column.roleId}-${
                params.row.privilegeId
              }`;
              if (this.editRolePriData.has(_rolePri)) {
                this.editRolePriData.delete(_rolePri);
              } else {
                //添加：1 删除：0
                this.editRolePriData.set(_rolePri, value ? 1 : 0);
              }
            }
          }
        });
      };
      //绘制角色list
      let roleArr = [];  
      for (let [index, elem] of this.roleList.entries()) {
        roleArr.push({
          key: elem.roleId,
          roleId: elem.roleId,
          align: "center",
          renderHeader: (h, params) => {
            if (elem.category) {
              //自定义角色允许删除修改
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      "margin-right": "15px"
                    }
                  },
                  elem.roleName
                ),
                h("Icon", {
                  props: {
                    type: "compose",
                    size: 15
                  },
                  style: {
                    padding: "0 4px",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.currentRole = elem;
                      this.modifyShow();
                    }
                  }
                }),
                h("Icon", {
                  props: {
                    type: "trash-a",
                    size: 15
                  },
                  style: {
                    padding: "0 4px",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.currentRole = elem;
                      this.deleteShow();
                    }
                  }
                })
              ]);
            } else {
              //系统角色
              return h("div", elem.roleName);
            }
          },
          render: (h, params) => {
            return h("div", [priRaido(this, h, params)]);
          }
        });
      }
      return [
        {
          title: " ",
          key: "privilegeName"
        },
        ...roleArr
      ];
    },
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
      this.tableLoading = true;
      ApiGetPrivilegeList().then(res => {
        if (res.code == "success") {
          this.roleList = res.data.roleList;
          this.priTableData = res.data.privilegeRoleVoList;
          this.roleIntroData = res.data.roleList; //角色说明数据
          this.priIntroData = res.data.privilegeList; //权限说明数据
          this.tableLoading = false;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //新增角色
    newShow(name) {
      this.newModel = true;
      this.$refs[name].resetFields();
    },
    //新增角色保存
    newSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.newLoading = true;
          ApiPostRole(this.newForm).then(res => {
            this.newLoading = false;
            if (res.code == "success") {
              this.newModel = false;
              this.getPrivilegeList();
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    //修改角色
    modifyShow() {
      this.modifyModel = true;
      this.modifyForm.roleId = this.currentRole.roleId;
      this.modifyForm.roleName = this.currentRole.roleName;
      this.modifyForm.description = this.currentRole.description;
    },
    //修改角色保存
    modifySave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modifyLoading = true;
          ApiPutRole(this.modifyForm).then(res => {
            this.modifyLoading = false;
            if (res.code == "success") {
              this.modifyModel = false;
              this.getPrivilegeList();
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
      ApiDeleteRole(this.currentRole.roleId).then(res => {
        this.deleteLoading = false;
        if (res.code == "success") {
          this.deleteModel = false;
          this.getPrivilegeList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //查看权限说明
    showIntro() {
      this.introModel = true;
    },
    //权限配置保存
    saveRolePri() {
      let _arr = [...this.editRolePriData];
      if (_arr.length > 0) {
        for (let [index, elem] of _arr.entries()) {
          _arr[index] = elem.join("-");
        }
        this.priLoading = true;
        ApiPutPriAndRole(qs.stringify({ role_privilege: _arr.join("_") })).then(
          res => {
            this.priLoading = false;
            if (res.code == "success") {
              this.editRolePriData = new Map();
              this.getPrivilegeList();
            } else if (res.code == "task_exist") {
              taskExist(this, res.data);
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          }
        );
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
