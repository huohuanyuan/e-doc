/*
 * @Author: liuhaosheng 
 * @Date: 2018-08-14 15:33:46 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-05 17:15:31
 */
<template>
  <div class="own-div">
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        {{$t('page.personal')}}
      </p>
      <Tabs type="card" @on-click="onClickTabs">
        <TabPane :label="$t('title.baseInfo')">
          <div class="basic-info">
            <div class="user-img" @click="showStaffAvatar">
              <img alt="" :onerror="defaultAvatar" :src="avatarUrl">
              <div class="upload-cover">
                <Icon type="camera"></Icon>
              </div>
            </div>
            <Form class="basic-form" ref="userForm" :model="userForm" :label-width="80" label-position="right" :rules="userRule">
              <FormItem :label="$t('title.email')">
                <Input v-model.trim="userForm.email" disabled></Input>
              </FormItem>
              <FormItem prop="username" :label="$t('title.userName')">
                <Input v-model.trim="userForm.username"></Input>
              </FormItem>
              <!-- <FormItem prop="gender" label="性别">
                                <Input v-model.trim="userForm.gender"></Input>
                            </FormItem> -->
              <FormItem prop="firstName" :label="$t('title.firstName')">
                <Input v-model.trim="userForm.firstName"></Input>
              </FormItem>
              <FormItem prop="lastName" :label="$t('title.lastName')">
                <Input v-model.trim="userForm.lastName"></Input>
              </FormItem>
              <FormItem prop="country" :label="$t('title.country')">
                <Input v-model.trim="userForm.country"></Input>
              </FormItem>
              <FormItem prop="city" :label="$t('title.city')">
                <Input v-model.trim="userForm.city"></Input>
              </FormItem>
              <FormItem prop="tel" :label="$t('title.phone')">
                <Input v-model.trim="userForm.tel"></Input>
              </FormItem>
              <Button @click="postUserInfoModify('userForm')" type="primary" long> {{$t('operation.save')}} </Button>
            </Form>
          </div>
        </TabPane>
        <TabPane :label="$t('title.emailNote')">
          <Table stripe :columns="columnsUser" :data="userStudyList"></Table>
          <div class="page">
            <Page :total="study.total" size="small" :current="study.pageNum" :page-size="study.size" show-elevator show-sizer show-total @on-change="handleStudyPage" @on-page-size-change='handleStudyPageSize'>
            </Page>
          </div>
        </TabPane>
        <TabPane :label="$t('title.editPassowrd')">
          <Form ref="editPwd" :model="editPwd" :rules="editPwdInline" :label-width="120">
            <FormItem :label="$t('title.email')">
              <Input v-model.trim="editPwd.email" disabled></Input>
            </FormItem>
            <FormItem prop="password" :label="$t('title.oldPassword')">
              <Input type="password" v-model.trim="editPwd.password">
              </Input>
            </FormItem>
            <FormItem prop="newPassword" :label="$t('title.newPassword')">
              <Input type="password" v-model.trim="editPwd.newPassword">
              </Input>
            </FormItem>
            <FormItem prop="resetPassword" :label="$t('title.confirmPassword')">
              <Input type="password" v-model.trim="editPwd.resetPassword">
              </Input>
            </FormItem>
            <div class="one-footer">
              <Button type="primary" @click="postUserModifyPwd('editPwd')" long>{{$t('operation.save')}}</Button>
            </div>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
    <Modal v-model="userAvatarModal" :title="$t('title.uploadTitle')" :width="800">
      <div class="image-editor">
        <Row :gutter="16">
          <Col span="14" class="image-editor-con1">
          <div class="cropper">
            <img id="cropimg" alt="">
          </div>
          </Col>
          <Col span="10" class="image-editor-con1">
          <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
            <div id="preview1"></div>
          </Row>
          <div class="image-editor-con1-btn-con">
            <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange" id="fileinput1" class="fileinput" />
            <label class="filelabel" for="fileinput1">
              <Icon type="image"></Icon>&nbsp;{{$t('title.selectImg')}}</label>
            <span>
              <Button @click="postUserUpload" type="primary" icon="ios-cloud-upload"> {{$t('operation.upload')}} </Button>
            </span>
          </div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  ApiGetUserInfo,
  ApiPostUserInfoModify,
  ApiGetUserStudy,
  ApiPostUserStudy,
  ApiPostUserModifyPwd,
  ApiPostUserUpload
} from "@/api/own-space/own-space-api.js";
import qs from "qs";
import md5 from "js-md5";
import { resCode } from "common/js/code";
import Cropper from "cropperjs";
import "../../common/css/cropper.min.css";
import moment from "moment";
import axios from "axios";

// 项目客户 是否主要
const cliSwitch = (vm, h, params) => {
  return h(
    "i-switch",
    {
      props: {
        value: params.row.alert
      },
      on: {
        "on-change": value => {
          vm.switch(params.row.studyId, value);
        }
      }
    },
    [
      h(
        "span",
        {
          props: {
            slot: "open"
          }
        },
        "ON"
      ),
      h(
        "span",
        {
          props: {
            slot: "close"
          }
        },
        "OFF"
      )
    ]
  );
};

export default {
  data() {
    const validateOnePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('note.newPassword')));
      } else {
        if (this.editPwd.newPassword !== "") {
          // 对第二个密码框单独验证
          this.$refs.editPwd.validateField("resetPassword");
        }
        callback();
      }
    };
    const validateOnePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('note.inputNewPasswordAG')));
      } else if (value !== this.editPwd.newPassword) {
        callback(new Error(this.$t('note.twoPasswordError')));
      } else {
        callback();
      }
    };
    return {
      userAvatarModal: false,
      defaultAvatar:
        'this.src="' + require("../../common/img/d-avatar.jpg") + '"',
      userForm: {},
      userRule: {
        username: [{ required: true, message: " ", trigger: "blur" }]
      },
      userStudyList: [],
      cropperImg: {}, // 头像对象

      study: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      editPwd: {
        email: "",
        password: "",
        newPassword: "",
        resetPassword: ""
      },
      editPwdInline: {
        password: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: this.$t("note.lengthValidate",{number:6}),
            trigger: "blur"
          }
        ],
        newPassword: [
          { required: true, message: " ", trigger: "blur" },
          { validator: validateOnePass, trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: this.$t("note.lengthValidate",{number:6}),
            trigger: "blur"
          }
        ],
        resetPassword: [
          { required: true, message: " ", trigger: "blur" },
          { validator: validateOnePassCheck, trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: this.$t("note.lengthValidate",{number:6}),
            trigger: "blur"
          }
        ]
      },
      columnsUser: [
        {
          title: this.$t('title.numerical'),
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
          title: this.$t('title.studyName'),
          key: "studyName"
        },
        {
          title: this.$t('note.acceptEmail'),
          key: "alert",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              (function(vm) {
                return params.row.alert ? this.$t('operation。yes') : this.$t('operation。no');
              })(this)
            );
          }
        },
        {
          title: this.$t('operation.operation'),
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", [cliSwitch(this, h, params)]);
          }
        }
      ]
    };
  },
  methods: {
    // 项目 分页
    handleStudyPage(value) {
      this.study.pageNum = value;
      this.getUserStudy();
    },
    handleStudyPageSize(value) {
      this.study.pageSize = value;
      this.getUserStudy();
    },
    // 请求基本信息
    getUserInfo() {
      ApiGetUserInfo().then(res => {
        if (res.code == "success") {
          this.userForm = res.data;
          this.editPwd.email = res.data.email;
        } else {
        this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 修改保存个人信息
    postUserInfoModify(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            userId: this.userForm.userId,
            username: this.userForm.username,
            email: this.userForm.email,
            lastName: this.userForm.lastName,
            firstName: this.userForm.firstName,
            gender: this.userForm.gender,
            tel: this.userForm.tel,
            country: this.userForm.country,
            city: this.userForm.city
          };
          ApiPostUserInfoModify(qs.stringify(data)).then(res => {
            if (res.code == "success") {
              this.$Message.success(this.$t('note.editSucc'));
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 请求项目是否接受邮件
    getUserStudy() {
      ApiGetUserStudy(this.study).then(res => {
        if (res.code == "success") {
          this.userStudyList = res.data;
          this.study.total = res.total;
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //点击切换 tabs
    onClickTabs(index) {
      if (index == 1) {
        this.getUserStudy();
      } else if (index == 2) {
      }
    },
    // 点击出现上传图片模态框
    showStaffAvatar() {
      this.userAvatarModal = true;
    },
    /**
     判断switch 开关 
     @param {studyId}   studyId
     @param {Boolean} value 返回当前的状态 true | false
    */
    switch(studyId, value) {
      let data = {
        studyId: studyId,
        alert: value
      };
      ApiPostUserStudy(qs.stringify(data)).then(res => {
        if (res.code == "success") {
          this.$Message.success(this.$t('note.editSucc'));
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    // 修改 密码
    postUserModifyPwd(name) {
      this.$refs[name].validate(valid => {
        let data = {
          email: this.editPwd.email,
          password: md5(this.editPwd.password),
          newPassword: md5(this.editPwd.newPassword)
        };
        if (valid) {
          ApiPostUserModifyPwd(qs.stringify(data)).then(res => {
            if (res.code == "success") {
              this.$Message.success(this.$t('note.editSucc'));
              this.$refs[name].resetFields();
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 上传图片
    postUserUpload() {
      if (this.cropperImg.url) {
        let data = {};
        data.base64 = this.cropperImg
          .getCroppedCanvas()
          .toDataURL()
          .substr(22);

        ApiPostUserUpload(qs.stringify(data)).then(res => {
          if (res.code == "success") {
            this.$Message.success(this.$t('note.uploadSucc'));
            this.userAvatarModal = false;
            // this.randomNum = Math.random();
          } else {
            this.$Message.error(resCode(this, res.code));
          }
        });
      }
    },
    // 限制上传图片的大小
    handleChange(e) {
      let file = e.target.files[0];
      if (file.size / 1024 > 800) {
        this.$Message.error({
          content: this.$t('note.imageError'),
          duration: 10
        });
        return false;
      }
      let reader = new FileReader();
      reader.onload = () => {
        this.cropperImg.replace(reader.result);
        reader.onload = null;
      };
      reader.readAsDataURL(file);
    }
  },
  computed: {
    avatarUrl() {
      console.log(axios.defaults.baseURL + "/user/download_avatar?" + new Date());
      return axios.defaults.baseURL + "/user/download_avatar?" + new Date();
      // let url = `${axios.defaults.baseURL}/user/download_avatar?+ ${new Date()}`;
      // return url;
    }
  },
  mounted() {
    this.getUserInfo();
    let img = document.getElementById("cropimg");
    this.cropperImg = new Cropper(img, {
      dragMode: "move",
      preview: "#preview1",
      restore: false,
      center: false,
      highlight: false,
      cropBoxMovable: false,
      toggleDragModeOnDblclick: false
    });
  }
};
</script>

<style lang="scss">
@import "../../common/css/variable.scss";
@import "../../common/css/image-editor";

.own-div {
  .basic-info {
    display: flex;
    justify-content: space-between;
    .basic-form {
      flex: 1;
      padding: 10px 0;
      .ivu-form-item {
        margin-bottom: 10px;
      }
    }
    .user-img {
      width: 130px;
      height: 130px;
      text-align: center;
      margin: 10px 50px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      cursor: pointer;
    }

    .user-img img {
      width: 100%;
      height: 100%;
    }

    .user-img .upload-cover {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
    }

    .user-img .upload-cover i {
      color: #fff;
      font-size: 40px;
      line-height: 130px;
    }

    .user-img:hover .upload-cover {
      display: block;
    }
  }
  .one-footer {
    margin-left: 120px;
  }
  .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    color: #2d8cf0;
  }
}
</style>
