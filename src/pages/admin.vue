/*
 * @Author: liuhaosheng 
 * @Date: 2018-08-13 10:31:21 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-06 17:43:18
 */
<template>
<div class="admin-wrapper">
 <Layout :style="{height:'100%'}">
    <div class="admin-header">
      <div class="logo-wrapper">
        <img src="/static/edoc-icon.png" alt="">
        <div class="text">
          <p>医文档</p>
          <p>医学电子文档管理系统</p>
        </div>
      </div>
      <div class="list">
        <li class="iconfont"> 欢迎超级管理员：superadmin@m-edoc.com </li>
        <li @click="onClickLoginOut"> 退出登陆 </li>
      </div>
    </div>
    <Layout :style="{background: '#F9F9F9',padding:'10px',height:'100%'}">
      <Sider hide-trigger :style="{background: '#F9F9F9'}" :width="150">
        <div class="admin-slider">
          <router-link :to="{}" class="cell">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shouye"></use>
            </svg>
            <p> 公司信息 </p>
          </router-link>
        </div>
      </Sider>
      <Content :style="{background: '#F9F9F9',height:'100%'}">
        <div class="content">
          <!-- <router-view></router-view> -->
          <div class="company-div">
            <p>
              <Button type="warning" @click="onClickNewCompany"> 创建公司 </Button>
            </p>
            <Breadcrumb v-show="companyNameShow">
              <BreadcrumbItem @click.native="getSuperCompanyList"> 公司 </BreadcrumbItem>
              <BreadcrumbItem @click.native="getSuperCompanyStudy"> {{companyName}} </BreadcrumbItem>
              <BreadcrumbItem v-show="userShow"> {{ studyName }} </BreadcrumbItem>

              <Button type="primary" @click="addStudyFun" class="add-user" v-show="studyShow"> 新建项目 </Button>
              <Button type="primary" @click="addUserFun(true)" class="add-user" v-show="userShow"> 添加人员 </Button>

            </Breadcrumb>
            <div class="company-table" v-show="companyShow">
              <Table stripe :columns="columnscompany" :data="companyList"></Table>
              <div class="page">
                <Page :total="company.total" size="small" :current="company.pageNum" :page-size="company.size" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'>
                </Page>
              </div>
            </div>
            <div class="study-table" v-show="studyShow">
              <Table stripe :columns="columnsStudy" :data="studyList"></Table>
              <div class="page">
                <Page :total="study.total" size="small" :current="study.pageNum" :page-size="study.size" show-elevator show-sizer show-total @on-change="handleStudyPage" @on-page-size-change='handleStudyPageSize'>
                </Page>
              </div>
            </div>
            <div class="user-div" v-show="userShow">
              <Table stripe :columns="columnsUser" :data="userList"></Table>
              <div class="page">
                <Page :total="user.total" size="small" :current="user.pageNum" :page-size="user.size" show-elevator show-sizer show-total @on-change="handleUserPage" @on-page-size-change='handleUserPageSize'>
                </Page>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
    <Modal v-model="newCompanyModal" title="新建公司" :mask-closable="false" :width="600">
      <Form ref="formNewCompany" :model="formNewCompany" :rules="companyInline" :label-width="100">
        <FormItem prop="companyName" label="公司名称">
          <Input v-model.trim="formNewCompany.companyName"></Input>
        </FormItem>
        <FormItem prop="contact" label="公司联系人">
          <Input v-model.trim="formNewCompany.contact"></Input>
        </FormItem>
        <FormItem prop="contactEmail" label="联系人邮箱">
          <Input v-model.trim="formNewCompany.contactEmail" type="email"></Input>
        </FormItem>
        <FormItem prop="contactTel" label="联系人电话">
          <Input v-model.trim="formNewCompany.contactTel"></Input>
        </FormItem>
        <FormItem prop="contactMobile" label="联系人手机">
          <Input v-model.trim="formNewCompany.contactMobile"></Input>
        </FormItem>
        <FormItem prop="address" label="公司地址">
          <Input v-model.trim="formNewCompany.address"></Input>
        </FormItem>
        <FormItem prop="description" label="公司描述">
          <Input v-model="formNewCompany.description" type="textarea" :rows="2"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="postSuperCompany('formNewCompany')" type="primary" long> 保存 </Button>
      </div>
    </Modal>
    <!--  修改公司信息  -->
    <Modal v-model="editCompanyModal" title="新建公司" :mask-closable="false" :width="600">
      <Form ref="formEditCompany" :model="formEditCompany" :rules="companyInline" :label-width="100">
        <FormItem prop="companyName" label="公司名称">
          <Input v-model.trim="formEditCompany.companyName"></Input>
        </FormItem>
        <FormItem prop="contact" label="公司联系人">
          <Input v-model.trim="formEditCompany.contact"></Input>
        </FormItem>
        <FormItem prop="contactEmail" label="联系人邮箱">
          <Input v-model.trim="formEditCompany.contactEmail" type="email"></Input>
        </FormItem>
        <FormItem prop="contactTel" label="联系人电话">
          <Input v-model.trim="formEditCompany.contactTel"></Input>
        </FormItem>
        <FormItem prop="contactMobile" label="联系人手机">
          <Input v-model.trim="formEditCompany.contactMobile"></Input>
        </FormItem>
        <FormItem prop="address" label="公司地址">
          <Input v-model.trim="formEditCompany.address"></Input>
        </FormItem>
        <FormItem prop="description" label="公司描述">
          <Input v-model="formEditCompany.description" type="textarea" :rows="2"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="postSuperCompanyUpdate('formEditCompany')" type="primary" long> 保存 </Button>
      </div>
    </Modal>
    <!--  公司详情  -->
    <Modal v-model="infoCompanyModal" title="公司详情" :mask-closable="false" :width="600" class="info-modal">
      <Form :model="formEditCompany" :label-width="100">
        <FormItem label="公司名称:">
          <span>{{ formEditCompany.companyName }}</span>
        </FormItem>
        <FormItem label="公司联系人:">
          <span>{{ formEditCompany.contact }}</span>
        </FormItem>
        <FormItem label="联系人邮箱:">
          <span>{{ formEditCompany.contactEmail }}</span>
        </FormItem>
        <FormItem label="联系人电话:">
          <span>{{ formEditCompany.contactTel }}</span>
        </FormItem>
        <FormItem label="联系人手机:">
          <span>{{ formEditCompany.contactMobile }}</span>
        </FormItem>
        <FormItem label="公司地址:">
          <span>{{ formEditCompany.address }}</span>
        </FormItem>
        <FormItem label="公司描述:">
          <span>{{ formEditCompany.description }}</span>
        </FormItem>
        <FormItem label="存储空间:">
          <span> {{ formEditCompany.storageSize}}G / {{ formEditCompany.storageMaxSize }}G </span>
          <Button type="primary" @click="sizeFun">扩充容量</Button>
        </FormItem>
        <FormItem label="是否激活:">
          <span>{{ formEditCompany.activated ? "是":"否" }}</span>
        </FormItem>
        <FormItem label="创建时间:">
          <span>{{ formEditCompany.createdtime }}</span>
        </FormItem>
        <FormItem label="更新时间:">
          <span>{{ formEditCompany.updatedtime }}</span>
        </FormItem>
      </Form>
      <div slot="footer">
      </div>
    </Modal>
    <!-- 更新有效时间 -->
    <Modal v-model="timeModal" title="更新有效时间" :mask-closable="false" :width="600">
      <Form ref="time" :model="time" :rules="timeInline" :label-width="110">
        <FormItem label="现在有效时间">
          <DatePicker type="date" :clearable='false' v-model="time.oldDeadline" disabled></DatePicker>
        </FormItem>
        <FormItem prop="deadline" label="更新有效时间">
          <DatePicker type="date" :clearable='false' v-model="time.deadline" :options="options"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="postSuperStudyDeadline('time')" type="primary" long> 保存 </Button>
      </div>
    </Modal>
    <!--  扩充容量  -->
    <Modal v-model="sizeModal" title="扩充容量" :mask-closable="false" :width="600" class="size-modal">
      <Form ref="size" :model="size" :rules="sizeInline" :label-width="80">
        <FormItem label="现有内存">
          <Input v-model.trim="formEditCompany.storageMaxSize" disabled></Input>
        </FormItem>
        <FormItem prop="size" label="添加内存">
          <InputNumber v-model="size.size" :min="1" :max="1000000000"></InputNumber> (只能输入正整数！)
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="postSuperCompanyRecharge('size')" type="primary" long> 保存 </Button>
      </div>
    </Modal>
    <!-- 添加人员 -->
    <Modal v-model="userModel" :mask-closable="false" width="800">
      <p slot="header" style="text-align:center">
        <span v-if="modelType">新增用户</span>
        <span v-else>修改用户</span>
      </p>
      <div>
        <Form ref="userForm" :model="userForm" :rules="userFormRule" :label-width="80">
          <Row>
            <Col span="11">
            <FormItem label="用户" prop="username">
              <Input v-model.trim="userForm.username"></Input>
            </FormItem>
            </Col>
            <Col span="11">
            <FormItem label="邮箱" prop="email">
              <Input v-model.trim="userForm.email" :disabled="!modelType" type="email"></Input>
            </FormItem>
            </Col>
            <Col span="2"></Col>
          </Row>
        </Form>
        <Form ref="siteRoleForm" :model="siteRoleForm" :rules="siteRoleRule" :label-width="80">
          <Row>
            <Col span="11">
            <FormItem label="机构" prop="siteId">
              <Select v-model="siteRoleForm.siteId" @on-change="siteChange">
                <Option v-for="item in siteList" :value="item.siteId" :key="item.siteId">{{item.siteName}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="11">
            <FormItem label="角色" prop="roleId">
              <Select v-model="siteRoleForm.roleId">
                <Option v-for="item in roleList" :value="item.roleId" :disabled="item.disabled" :key="item.roleId">{{item.roleName}}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="2">
            <div class="add-btn">
              <Button type="dashed" size="small" icon="plus" @click="siteRoleSave('siteRoleForm')">添加</Button>
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
        <Button v-if="modelType" type="primary" long @click="newSave('userForm')">确定</Button>
        <Button v-else type="primary" long @click="modifySave('userForm')">确定</Button>
      </div>
    </Modal>
    <!--  删除人员  -->
    <Modal v-model="deleteModel" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="padding:0 10px">
        <p>用户&nbsp;&nbsp;{{currentRow.username}}&nbsp;&nbsp; 删除后，该用户的所有任务会交给以下管理员用户,是否继续删除?</p>
        <RadioGroup v-model="selectAdminId">
          <Radio v-for="item in adminList" :label="item.userId" :key="item.userId">
            <span>{{item.username}}</span>
          </Radio>
        </RadioGroup>
      </div>
      <div slot="footer">
        <Button type="error" long @click="deleleSave">确定</Button>
      </div>
    </Modal>
    <!--  新建项目  -->
    <Modal v-model="newStudyModal" title="新建项目" :mask-closable="false" :width="600" class="add-study">
      <Form ref="newStudy" :model="newStudy" :rules="studyInline" :label-width="110">
        <FormItem prop="studyName" label="项目名称">
          <Input v-model.trim="newStudy.studyName"></Input>
        </FormItem>
        <FormItem prop="protocol" label="项目编码">
          <Input v-model.trim="newStudy.protocol"></Input>
        </FormItem>
        <FormItem prop="deadlineLong" label="有效时间">
          <DatePicker :editable='false' type="date" v-model="newStudy.deadlineLong" :options="options"></DatePicker>
        </FormItem>
        <FormItem prop="username" label="管理员名称">
          <Input v-model.trim="newStudy.username"></Input>
        </FormItem>
        <FormItem prop="email" label="管理员邮箱">
          <Input v-model.trim="newStudy.email" type="email"></Input>
        </FormItem>
        <FormItem prop="phase" label="项目阶段">
          <Input v-model.trim="newStudy.phase"></Input>
        </FormItem>
        <FormItem label="目录类型:" prop="folder">
          <CheckboxGroup v-model="newStudy.folder" @on-change="checkAllGroupChange">
            <Checkbox label="0"> 模板目录 </Checkbox>
            <Checkbox label="1"> 自定义目录 </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem prop="folderLang" label="模板目录语言" v-if="folderLangShow">
          <RadioGroup v-model="newStudy.folderLang">
            <Radio label="en"> 英文 </Radio>
            <Radio label="zh"> 中文 </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="description" label="项目描述">
          <Input v-model="newStudy.description" type="textarea" :rows="2"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="postSuperStudyAdd('newStudy')" type="primary" long> 保存 </Button>
      </div>
    </Modal>
  </Layout>
</div>
 

</template>

<script>
import {
  ApiPostSuperCompany,
  ApiGetSuperCompanyList,
  ApiGetSuperCompany,
  ApiPostSuperCompanyUpdate,
  ApiPostSuperCompanyLock,
  ApiGetSuperCompanyStudy,
  ApiPostSuperStudyDeadline,
  ApiPostSuperCompanyRecharge,
  ApiGetSuperStudyUser,
  ApiGetSuperStudyRole,
  ApiGetSuperStudysite,
  ApiPostSuperStudyUser,
  ApiPostSuperStudyUserUpdate,
  ApiGetSuperManager,
  ApiDeletSuperUser,
  ApiPostSuperStudyAdd
} from "@/api/admin/admin-api.js";
import qs from "qs";
import { resCode } from "common/js/code";
import moment from "moment";

// 编辑按钮
const editButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "primary",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.edit(params.row.companyId);
        }
      }
    },
    "编辑"
  );
};
// 人员编辑
const editUserButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "primary",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.addUserFun(false, params.row);
        }
      }
    },
    "编辑"
  );
};
// 项目按钮
const studyButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "ghost",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.studyFun(params.row.companyId, params.row.companyName);
        }
      }
    },
    "项目"
  );
};
// 项目按钮
const userButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "ghost",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.userFun(params.row.studyId, params.row.studyName);
        }
      }
    },
    "人员"
  );
};
// 激活按钮
const activeButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "info",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.postSuperCompanyLock(params.row.companyId, true);
        }
      }
    },
    "激活"
  );
};
// 冻结按钮
const blockButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "warning",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.postSuperCompanyLock(params.row.companyId, false);
        }
      }
    },
    "冻结"
  );
};
// 查看按钮
const viewButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "success",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.infoFun(params.row.companyId);
        }
      }
    },
    "查看"
  );
};
// 更新有效时间
const timeButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "primary",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.timeFun(params.row);
        }
      }
    },
    "更新有效时间"
  );
};
// 删除按钮
const deleteButton = (vm, h, params) => {
  return h(
    "Button",
    {
      props: {
        type: "error",
        size: "small"
      },
      style: {
        margin: "3px 2px"
      },
      on: {
        click: () => {
          vm.deleteFun(params.row);
        }
      }
    },
    "删除"
  );
};
export default {
  data() {
    return {
      currentRow: {},
      userId: "",
      newCompanyModal: false,
      infoCompanyModal: false,
      editCompanyModal: false,
      newStudyModal: false,
      userModel: false,
      timeModal: false,
      sizeModal: false,
      deleteModel: false,
      companyShow: true,
      studyShow: false,
      userShow: false,
      folderLangShow: false,
      studyList: [],
      companyName: "",
      studyName: "",
      companyNameShow: false,
      companyList: [],
      studyId: "",
      adminList: [],
      selectAdminId: "",
      companyId: "",
      time: {
        oldDeadline: "",
        deadline: ""
      },
      size: {
        size: 0
      },
      sizeInline: {
        size: [
          {
            required: true,
            message: " ",
            type: "number",
            trigger: "blur"
          }
        ]
      },
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      timeInline: {
        deadline: [
          {
            required: true,
            message: " ",
            type: "date",
            trigger: "change"
          }
        ]
      },
      columnscompany: [
        {
          title: "序号",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.company.pageNum - 1) * vm.company.pageSize +
                  params.index +
                  1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "公司编号",
          key: "companyCode"
        },
        {
          title: "公司名称",
          key: "companyName"
        },
        {
          title: "创建时间",
          key: "createdtime",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.createdtime
                  ? moment(params.row.createdtime).format("YYYY-MM-DD")
                  : "";
              })(this)
            );
          }
        },
        {
          title: "是否激活",
          key: "activated",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.activated ? "是" : "否";
              })(this)
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 220,
          align: "center",
          render: (h, params) => {
            return h("div", [
              studyButton(this, h, params),
              editButton(this, h, params),
              viewButton(this, h, params),
              (function(vm) {
                if (params.row.activated) {
                  return blockButton(vm, h, params);
                }
              })(this),
              (function(vm) {
                if (!params.row.activated) {
                  return activeButton(vm, h, params);
                }
              })(this)
            ]);
          }
        }
      ],
      columnsStudy: [
        {
          title: "序号",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.study.pageNum - 1) * vm.study.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "项目名称",
          key: "studyName"
        },
        {
          title: "项目阶段",
          key: "phase"
        },
        {
          title: "有效时间",
          key: "deadline",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.deadline
                  ? moment(params.row.deadline).format("YYYY-MM-DD")
                  : "";
              })(this)
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 180,
          align: "center",
          render: (h, params) => {
            return h("div", [
              userButton(this, h, params),
              timeButton(this, h, params)
            ]);
          }
        }
      ],
      columnsUser: [
        {
          title: "序号",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                let _code =
                  (vm.user.pageNum - 1) * vm.user.pageSize + params.index + 1;
                return _code;
              })(this)
            );
          }
        },
        {
          title: "名称",
          key: "username"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          key: "siteRole",
          title: "机构&角色",
          render: (h, params) => {
            let _arr = [];
            for (let [i,site] of params.row.siteList.entries()) {
              for (let [j,role] of site.roleList.entries()) {
                _arr.push(h("Tag", `${site.siteName}--${role.roleName}`));
              }
            }
            return h("div", _arr);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 140,
          align: "center",
          render: (h, params) => {
            return h("div", [
              editUserButton(this, h, params),
              deleteButton(this, h, params)
            ]);
          }
        }
      ],
      userList: [],
      company: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      study: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      user: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      formNewCompany: {
        companyName: "",
        contact: "",
        contactEmail: "",
        contactTel: "",
        contactMobile: "",
        address: "",
        description: ""
      },
      formEditCompany: {
        companyName: "",
        contact: "",
        contactEmail: "",
        contactTel: "",
        contactMobile: "",
        address: "",
        description: ""
      },
      companyInline: {
        companyName: [{ required: true, message: " ", trigger: "blur" }],
        contact: [{ required: true, message: " ", trigger: "blur" }],
        contactEmail: [
          {
            required: true,
            message: " ",
            trigger: "blur"
          },
          {
            max: 64,
            message: "邮箱长度不能超过64位",
            trigger: "blur"
          }
        ],
        contactTel: [{ required: true, message: " ", trigger: "blur" }],
        contactMobile: [{ required: true, message: " ", trigger: "blur" }],
        address: [{ required: true, message: " ", trigger: "blur" }]
      },
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
            message: "长度不能超过32",
            max: 32,
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
            message: "长度不能超过64",
            max: 64,
            trigger: "blur"
          }
        ]
      },
      modelType: true, //模态框类型：新建true 修改false
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
      siteRoleList: [],
      siteList: [],
      roleList: [],
      newStudy: {
        studyName: "",
        protocol: "",
        deadlineLong: "",
        phase: "",
        description: "",
        folderLang: "",
        email: "",
        username: "",
        folder: []
      },
      studyInline: {
        studyName: [{ required: true, message: " ", trigger: "blur" }],
        username: [{ required: true, message: " ", trigger: "blur" }],
        protocol: [{ required: true, message: " ", trigger: "blur" }],
        deadlineLong: [
          {
            required: true,
            message: " ",
            type: "date",
            trigger: "change"
          }
        ],
        phase: [{ required: true, message: " ", trigger: "blur" }],
        folderLang: [{ required: true, message: " ", trigger: "change" }],
        folder: [
          {
            required: true,
            type: "array",
            min: 1,
            message: " ",
            trigger: "change"
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
            message: "长度不能超过64",
            max: 64,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 公司 分页
    handlePage(value) {
      this.company.pageNum = value;
      this.getSuperCompanyList();
    },
    handlePageSize(value) {
      this.company.pageSize = value;
      this.getSuperCompanyList();
    },
    // 项目 分页
    handleStudyPage(value) {
      this.study.pageNum = value;
      this.getSuperCompanyStudy();
    },
    handleStudyPageSize(value) {
      this.study.pageSize = value;
      this.getSuperCompanyStudy();
    },
    // 人员分页
    handleUserPage(value) {
      this.user.pageNum = value;
      this.getSuperStudyUser();
    },
    handleUserPageSize(value) {
      this.user.pageSize = value;
      this.getSuperStudyUser();
    },
    // 点击新建公司
    onClickNewCompany() {
      this.newCompanyModal = true;
      this.$refs["formNewCompany"].resetFields();
    },
    // 新建公司
    postSuperCompany(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          ApiPostSuperCompany(qs.stringify(this.formNewCompany)).then(res => {
            if (res.code == "success") {
              this.$Message.success("公司新建成功!");
              this.getSuperCompanyList();
              this.newCompanyModal = false;
              this.companyShow = true;
              this.studyShow = false;
              this.userShow = false;
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 请求公司列表
    getSuperCompanyList() {
      ApiGetSuperCompanyList(this.company).then(res => {
        if (res.code == "success") {
          this.companyList = res.data;
          this.company.total = res.total;
          this.companyShow = true;
          this.studyShow = false;
          this.userShow = false;
          this.companyNameShow = false;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 修改公司信息
    edit(companyId) {
      this.getSuperCompany(companyId);
      this.editCompanyModal = true;
    },
    // 请求公司详情
    infoFun(companyId) {
      this.getSuperCompany(companyId);
      this.infoCompanyModal = true;
    },
    // 请求公司详情
    getSuperCompany(companyId) {
      ApiGetSuperCompany(companyId).then(res => {
        if (res.code == "success") {
          this.formEditCompany = res.data;
          this.formEditCompany.createdtime = moment(
            this.formEditCompany.createdtime
          ).format("YYYY-MM-DD");
          this.formEditCompany.updatedtime = moment(
            this.formEditCompany.updatedtime
          ).format("YYYY-MM-DD");
          this.formEditCompany.storageMaxSize =
            this.formEditCompany.storageMaxSize / (1024 * 1024 * 1024);
          this.formEditCompany.storageSize = (
            this.formEditCompany.storageSize /
            (1024 * 1024 * 1024)
          ).toFixed(2);
          this.companyId = this.formEditCompany.companyId;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 修改完成 保存
    postSuperCompanyUpdate(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            companyId: this.formEditCompany.companyId,
            companyCode: this.formEditCompany.companyCode,
            companyName: this.formEditCompany.companyName,
            contact: this.formEditCompany.contact,
            contactEmail: this.formEditCompany.contactEmail,
            contactTel: this.formEditCompany.contactTel,
            contactMobile: this.formEditCompany.contactMobile,
            address: this.formEditCompany.address,
            description: this.formEditCompany.description
          };
          ApiPostSuperCompanyUpdate(qs.stringify(data)).then(res => {
            if (res.code == "success") {
              this.$Message.success("公司修改成功!");
              this.getSuperCompanyList();
              this.editCompanyModal = false;
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 激活冻结公司
    postSuperCompanyLock(companyId, activated) {
      let data = {
        companyId: companyId,
        activated: activated
      };
      ApiPostSuperCompanyLock(qs.stringify(data)).then(res => {
        if (res.code == "success") {
          this.$Message.success("修改成功");
          this.getSuperCompanyList();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 点击项目按钮
    studyFun(companyId, companyName) {
      this.companyId = companyId;
      this.companyName = companyName;
      this.companyNameShow = true;
      this.getSuperCompanyStudy();
      this.study.total = 0;
      this.study.pageNum = 1;
      this.study.pageSize = 10;
    },
    // 请求公司下的项目列表
    getSuperCompanyStudy() {
      ApiGetSuperCompanyStudy(this.companyId, this.study).then(res => {
        if (res.code == "success") {
          this.studyList = res.data;
          this.study.total = res.total;
          this.companyShow = false;
          this.userShow = false;
          this.studyShow = true;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 点击更新有效时间
    timeFun(data) {
      this.timeModal = true;
      this.studyId = data.studyId;
      this.time.deadline = "";
      this.$refs["time"].resetFields();
      this.time.oldDeadline = moment(data.deadline).format("YYYY-MM-DD");
    },
    // 保存更新后的有效时间
    postSuperStudyDeadline(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            studyId: this.studyId,
            deadline: moment(this.time.deadline).valueOf()
          };
          ApiPostSuperStudyDeadline(qs.stringify(data)).then(res => {
            if (res.code == "success") {
              this.$Message.success("修改成功!");
              this.getSuperCompanyStudy(this.companyId);
              this.timeModal = false;
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 点击添加 内存
    sizeFun() {
      this.sizeModal = true;
      this.$refs["size"].resetFields();
    },
    // 添加内存，保存
    postSuperCompanyRecharge(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            companyId: this.companyId,
            size:
              (this.size.size + this.formEditCompany.storageMaxSize) *
              (1024 * 1024 * 1024)
          };
          ApiPostSuperCompanyRecharge(qs.stringify(data)).then(res => {
            if (res.code == "success") {
              this.$Message.success("修改成功!");
              this.sizeModal = false;
              this.infoCompanyModal = false;
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 点击人员按钮
    userFun(studyId, studyName) {
      this.studyId = studyId;
      this.studyName = studyName;
      this.getSuperStudyUser();
      this.user.total = 0;
      this.user.pageNum = 1;
      this.user.pageSize = 10;
    },
    // 超级管理员管理项目成员
    getSuperStudyUser() {
      let data = {
        studyId: this.studyId,
        pageNum: this.user.pageNum,
        pageSize: this.user.pageSize
      };
      ApiGetSuperStudyUser(data).then(res => {
        if (res.code == "success") {
          this.userList = res.data;
          this.user.total = res.total;
          this.studyShow = false;
          this.userShow = true;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 点击添加人员
    addUserFun(value, data) {
      this.modelType = value;
      this.userModel = true;
      if (value) {
        //新建
        this.userForm.username = "";
        this.userForm.email = "";
        this.siteRoleList = [];
        this.$refs["userForm"].resetFields();
        this.$refs["siteRoleForm"].resetFields();
      } else {
        this.userId = data.userId;
        this.userForm.username = data.username;
        this.userForm.email = data.email;
        //给siteRoleList赋值
        this.siteRoleList = [];
        for (let [i,site] of data.siteList.entries()) {
          for (let[k, role] of site.roleList.entries()) {
            this.siteRoleList.push({
              siteId: site.siteId,
              siteName: site.siteName,
              roleId: role.roleId,
              roleName: role.roleName,
              tagName: `${site.siteId}-${role.roleId}`,
              userId: data.userId
            });
          }
        }
      }
      this.getSiteList();
      this.getRoleList();
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
    //获取sitelist
    getSiteList() {
      ApiGetSuperStudysite(this.studyId).then(res => {
        if (res.code == "success") {
          this.siteList = res.data;
          this.siteList = [{ siteId: 0, siteName: "全部" }, ...this.siteList];
        }
      });
    },
    //获取rolelist
    getRoleList() {
      ApiGetSuperStudyRole(this.studyId).then(res => {
        if (res.code == "success") {
          this.roleList = res.data;
        }
      });
    },
    siteChange(value) {
      //如果选择全部site 则删除“项目管理员选项"
      if (value == 0) {
        //全部siteid：0 项目管理员roleId：9
        for (let  [index, elem] of this.roleList.entries()) {
          if (elem.roleId == 9) {
            elem.disabled = false;
            break;
          }
        }
      } else {
        for (let  [index, elem]of this.roleList.entries()) {
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
    //新建用户保存
    newSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.siteRoleList.length > 0) {
            ApiPostSuperStudyUser({
              username: this.userForm.username,
              email: this.userForm.email,
              userRoleSSList: this.siteRoleList,
              currentStudyId: this.studyId
            }).then(res => {
              if (res.code == "success") {
                this.userModel = false;
                this.$Message.success("添加成功!");
                this.getSuperStudyUser();
              } else {
                this.$Message.error(resCode(this, res.code));
              }
            });
          } else {
            this.$Message.error("请添加机构和角色");
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
            ApiPostSuperStudyUserUpdate({
              username: this.userForm.username,
              email: this.userForm.email,
              userRoleSSList: this.siteRoleList,
              currentStudyId: this.studyId,
              userId: this.userId
            }).then(res => {
              if (res.code == "success") {
                this.$Message.success("修改成功!");
                this.userModel = false;
                this.getSuperStudyUser();
              } else {
                this.$Message.error(resCode(this, res.code));
              }
            });
          } else {
            this.$Message.error("请添加机构和角色");
          }
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
    // 点击删除按钮
    deleteFun(data) {
      this.deleteModel = true;
      this.currentRow = data;
      this.getSuperManager();
    },
    //检索指定study下所有管理员
    getSuperManager() {
      ApiGetSuperManager(this.studyId).then(res => {
        if (res.code == "success") {
          if (res.data.length > 0) {
            this.adminList = res.data;
            this.selectAdminId = this.adminList[0].userId;
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //删除机构保存
    deleleSave() {
      ApiDeletSuperUser({
        userId: this.currentRow.userId,
        studyManagerId: this.selectAdminId,
        studyId: this.studyId
      }).then(res => {
        if (res.code == "success") {
          this.$Message.success("修改成功!");
          this.deleteModel = false;
          this.getSuperStudyUser();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //--------- 新建项目--------- //
    addStudyFun() {
      this.newStudyModal = true;
    },
    checkAllGroupChange(data) {
      if (data.length == 2) {
        this.folderLangShow = true;
        this.newStudy.folderType = 2;
      } else if (data.length == 1) {
        if (data[0] == 0) {
          this.folderLangShow = true;
          this.newStudy.folderType = 0;
        } else {
          this.newStudy.folderType = 1;
        }
      } else {
        this.folderLangShow = false;
      }
    },
    // 新建项目 保存
    postSuperStudyAdd(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            companyId: this.companyId,
            studyName: this.newStudy.studyName,
            protocol: this.newStudy.protocol,
            deadlineLong: moment(this.newStudy.deadlineLong).valueOf(),
            phase: this.newStudy.phase,
            description: this.newStudy.description,
            folderLang: this.newStudy.folderLang,
            email: this.newStudy.email,
            username: this.newStudy.username,
            folderType: this.newStudy.folderType
          };
          ApiPostSuperStudyAdd(qs.stringify(data)).then(res => {
            if (res.code == "success") {
              this.$Message.success("新建成功!");
              this.newStudyModal = false;
              this.getSuperCompanyStudy();
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 退出登陆
    onClickLoginOut() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("siteId");
      sessionStorage.removeItem("studyId");
      sessionStorage.removeItem("menuList");
      this.$router.push({ name: "login" });
    }
  },
  computed: {
    siteMap() {
      //保存siteid 和 siteName的对应关系，用于tag显示
      let _siteMap = new Map();
      for (let  [index, elem] of this.siteList.entries()) {
        _siteMap.set(elem.siteId, elem.siteName);
      }
      return _siteMap;
    },
    roleMap() {
      let _roleMap = new Map();
      for (let  [index, elem] of this.roleList.entries()) {
        _roleMap.set(elem.roleId, elem.roleName);
      }
      return _roleMap;
    }
  },
  mounted() {
    this.getSuperCompanyList();
  },
  created() {
    //检查本地是否已有token
    if (!sessionStorage["token"]) {
      this.$router.push({ name: "login" });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common/css/variable.scss";
.admin-wrapper {
  .admin-header {
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 0 10px;
    border-bottom: 1px solid $border-color;
    .logo-wrapper {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
      }
      .text {
        color: #191919;
        font-size: 14px;
        margin: 10px;
        p {
          font-weight: bold;
        }
      }
    }
    .list {
      display: flex;
      align-items: center;
      li {
        margin: 0 5px;
        cursor: pointer;
      }
    }
  }
  .admin-slider {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid $border-color;
    background-color: #fff;
    border-radius: 5px;
    margin-right: 10px;
    .cell {
      padding: 10px 0;
      text-align: center;
      color: #525e5a;
      &.router-link-active {
        color: $theme-green;
      }
      .icon {
        font-size: 35px;
        margin-bottom: 10px;
      }
    }
  }
  .content {
    height: 100%;
    min-width: 900px;
    overflow-x: auto;
  }

  .company-div {
    border: 1px solid $border-color;
    background: #fff;
    border-radius: 5px;
    padding: 10px;
    .company-table,
    .study-table {
      margin-top: 20px;
    }
    .ivu-breadcrumb {
      padding: 10px 5px;
      font-size: 16px;
      cursor: pointer;
    }
    .add-user {
      float: right;
      margin-right: 30px;
    }
  }
  .info-modal {
    .ivu-form-item {
      margin-bottom: 10px;
    }
    .ivu-btn-primary {
      margin-left: 30px;
    }
  }
  .size-modal {
    .ivu-input-number {
      width: 50%;
    }
  }
  .add-btn {
    padding: 4px;
  }
  .tag-wrapper {
    border: 1px dashed #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 0 10px;
  }
  .add-study {
    .ivu-date-picker {
      width: 100%;
    }
  }
}
</style>

