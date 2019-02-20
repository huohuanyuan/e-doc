<template>
  <div class="login-wrap">
    <div class="wrap">
      <div class="login-img">
        <img src="/static/img/lg-bg2.png" alt="">
      </div>
      <div class="login-content">
        <div class="header">
          <img src="/static/img/edoc.png" alt="">
          <div class="title">
            <p> {{$t('title.eDoc')}} </p>
            <p> {{$t('title.system')}} </p>
          </div>
        </div>
        <!-- 登录 start-->
        <div class="login" @keydown.enter="login('loginForm')" v-show="loginShow">
          <Form ref="loginForm" :model="loginForm" :rules="loginFormRule">
            <FormItem prop="userName">
              <Input v-model.trim="loginForm.userName" type="email">
              <svg class="icon" aria-hidden="true" slot="prepend">
                <use xlink:href="#icon-zhanghao"></use>
              </svg>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input v-model.trim="loginForm.password" type="password">
              <svg class="icon" aria-hidden="true" slot="prepend">
                <use xlink:href="#icon-mima"></use>
              </svg>
              </Input>
            </FormItem>
            <div class="cell">
              <span @click="showLogin"> {{$t('title.forgetPwd')}} </span>
              <Dropdown trigger="click" style="margin-left: 20px" @on-click="langChange">
                <a href="javascript:void(0)">
                  {{$t('title.language')}}
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="zh">中文</DropdownItem>
                  <DropdownItem name="en">English</DropdownItem>
                  <DropdownItem name="ja">日本語</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <FormItem>
              <Button @click="login('loginForm')" class="btn"> {{$t('operation.login')}} </Button>
            </FormItem>
          </Form>
        </div>
        <!-- 登录end -->

        <!-- 忘记密码 start-->
        <div v-show="resetShow" class="reset">
          <Form ref="forgetPwdForm" :model="forgetPwdForm" :rules="forgetPwdRule">
            <FormItem>
              {{$t('title.inputEmail')}}
            </FormItem>
            <FormItem prop="email">
              <Input v-model.trim="forgetPwdForm.email" type="email">
              <svg class="icon" aria-hidden="true" slot="prepend">
                <use xlink:href="#icon-youxiang"></use>
              </svg>
              </Input>
            </FormItem>
            <div class="reset-footer">
              <Button type="text" @click="showReset">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fanhui"></use>
                </svg> {{$t('operation.return')}} </Button>
              <Button size="small" @click="forgetPwd('forgetPwdForm')" type="primary">{{$t('operation.sure')}}</Button>
            </div>
          </Form>
        </div>
        <!-- 忘记密码end -->
        <!--  密码过期  -->
        <div class="one-login" v-if="oneLoginShow" @keydown.enter="putOnePwd('formOneLogin')">
          <Form ref="formOneLogin" :model="formOneLogin" :rules="ruleOneInline">
            <FormItem>
              {{$t('title.ediePassword')}}
            </FormItem>
            <Form-item prop="oldPwd">
              <Input size="large" type="password" v-model.trim="formOneLogin.oldPwd" :placeholder="$t('title.inputOldPassword')">
              </Input>
            </Form-item>
            <Form-item prop="newPwd">
              <Input size="large" type="password" v-model.trim="formOneLogin.newPwd" :placeholder="$t('title.inputNewPassword')">
              </Input>
            </Form-item>
            <Form-item prop="resetNewPwd">
              <Input size="large" type="password" v-model.trim="formOneLogin.resetNewPwd" :placeholder="$t('title.inputNewPasswordAG')">
              </Input>
            </Form-item>
            <div class="one-footer">
              <Button type="text" @click="showOneLogin('formOneLogin')">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fanhui"></use>
                </svg>
                {{$t('operation.return')}}</Button>
              <Button type="primary" @click="postUserPwd('formOneLogin')">{{$t('operation.sure')}}</Button>
            </div>
          </Form>
        </div>

      </div>
    </div>
    <div class="footer">
      <doc-footer></doc-footer>
    </div>
  </div>
</template>
<script>
import { postLogin, forgetPwdLogin, postUserPwd } from "@/api/api.js";
import md5 from "js-md5";
import qs from "qs";
import Cookies from "js-cookie";
import { resCode } from "common/js/code";
import Util from "common/js/util";
import DocFooter from "components/doc-footer";
export default {
  components: {
    DocFooter
  },
  data() {
    const validateOnePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("note.newPassword")));
      } else {
        if (this.formOneLogin.newPwd !== "") {
          // 对第二个密码框单独验证
          this.$refs.formOneLogin.validateField("resetNewPwd");
        }
        callback();
      }
    };
    const validateOnePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("title.inputNewPasswordAG")));
      } else if (value !== this.formOneLogin.newPwd) {
        callback(new Error(this.$t("note.twoPasswordError")));
      } else {
        callback();
      }
    };
    return {
      loginShow: true,
      resetShow: false,
      oneLoginShow: false,
      loginFormRule: {
        userName: [{ required: true, message: " ", trigger: "blur" }],
        password: [{ required: true, message: " ", trigger: "blur" }]
      },
      loginForm: {
        userName: "",
        password: ""
      },
      forgetPwdRule: {
        email: [
          { required: true, message: " ", trigger: "blur", type: "email" }
        ]
      },
      forgetPwdForm: {
        email: ""
      },
      formOneLogin: {
        oldPwd: "",
        newPwd: "",
        resetNewPwd: ""
      },
      ruleOneInline: {
        oldPwd: [
          { required: true, message: " ", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: this.$t("note.lengthValidate", { number: 6 }),
            trigger: "blur"
          }
        ],
        newPwd: [
          { validator: validateOnePass, trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: this.$t("note.lengthValidate", { number: 6 }),
            trigger: "blur"
          }
        ],
        resetNewPwd: [
          { validator: validateOnePassCheck, trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: this.$t("note.lengthValidate", { number: 6 }),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //登录
    login(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          postLogin(
            qs.stringify({
              email: this.loginForm.userName,
              password: md5(this.loginForm.password)
            })
          ).then(res => {
            if (res.code == "success") {
              //token 存储
              sessionStorage["name"] = res.data.name;
              sessionStorage["siteName"] = res.data.siteName;
              sessionStorage["studyName"] = res.data.studyName;
              this.$store.commit("setStudyName", res.data.studyName);
              this.$store.commit("setSiteName", res.data.siteName);
              //保存menuList
              Util.setPriMenuList(res.data.authorization.menu);
              //保存权限
              localStorage.setItem(
                "privilege",
                JSON.stringify(res.data.authorization.privilege)
              );
              //项目过期
              if (res.data.isExpire) {
                this.$Modal.warning({
                  title: this.$t("note"),
                  content: `${res.data.studyName} ${this.$t("projectExpired")}`
                });
              }

              sessionStorage["token"] = res.data.token;
                //跳转home页
              this.$router.push({ name: "home" });
            } else if (res.code == "super_success") {
                 //token 存储
              sessionStorage["token"] = res.data.token;
              //跳转超级管理员页面
              this.$router.push({ name: "admin" });
            } else if (
              res.code == "password_expired" ||
              res.code == "user_inactivated"
            ) {
              this.loginShow = !this.loginShow;
              this.oneLoginShow = !this.oneLoginShow;
            } else if (res.code == "super_success") {
              this.$Message.success(this.$t("title.success"));
              sessionStorage["token"] = res.data.token;
              this.$router.push({ name: "admin" });
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 点击忘记密码
    showLogin(name) {
      this.loginShow = !this.loginShow;
      this.resetShow = !this.resetShow;
      this.$refs["forgetPwdForm"].resetFields();
    },
    // 返回
    showReset() {
      this.loginShow = !this.loginShow;
      this.resetShow = !this.resetShow;
    },
    showOneLogin(name) {
      this.loginShow = !this.loginShow;
      this.oneLoginShow = !this.oneLoginShow;
      this.$refs[name].resetFields();
    },
    //忘记密码
    forgetPwd(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          forgetPwdLogin(
            qs.stringify({
              email: this.forgetPwdForm.email,
              lang: this.$i18n.locale
            })
          ).then(res => {
            if (res.code == "success") {
              this.$Message.success(this.$t("title.success"));
              Cookies.set("user", this.loginForm.userName);
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    // 密码过期，重置密码
    postUserPwd(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var data = {
            email: this.loginForm.userName,
            password: md5(this.formOneLogin.oldPwd),
            newPassword: md5(this.formOneLogin.newPwd)
          };
          postUserPwd(qs.stringify(data)).then(res => {
            if (res.code == "success") {
              this.$Message.success(this.$t("note.editSucc"));
              this.showOneLogin("formOneLogin");
            } else if (res.code == "fail") {
              this.$Message.error(this.$t("note.editfaile"));
            } else {
              this.$Message.error(resCode(this, res.code));
            }
          });
        }
      });
    },
    langChange(lang) {
      this.$i18n.locale = lang;
      Cookies.set("Lang", lang);
    }
  },
  mounted() {}
};
</script>


<style lang="scss" scoped>
@import "../common/css/variable.scss";
.login-wrap {
  width: 100%;
  height: 100%;
  background-color: #f5f8f7;
}
.footer {
  margin-top: -20px;
}
.wrap {
  width: 800px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-img {
  width: 55%;
  height: 450px;
}
.login-content {
  width: 45%;
  height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  text-align: center;
  box-shadow: 10px 10px 20px #e0e5e7;
}
.login-img img {
  width: 100%;
  height: 100%;
}
.header {
  margin-bottom: 30px;
  img {
    width: 60px;
    height: 60px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #0f2648;
  }
}

.reset-footer,
.one-footer {
  margin-left: 65px;
  padding: 15px 0px;
}
.one-footer {
  margin-left: 55px;
}
</style>
<style lang="scss">
@import "../common/css/variable.scss";
.login,
.reset,
.one-login {
  .ivu-form-item {
    margin-bottom: 8px;
  }
  .ivu-input {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
  }
  .ivu-input:focus {
    box-shadow: none;
  }
  .ivu-input-group-prepend {
    background: #fff;
    border: none;
  }
  .icon {
    font-size: 18px;
  }
  .cell {
    padding: 10px 5px;
    display: flex;
    justify-content: space-between;
    span {
      cursor: pointer;
    }
  }
  .ivu-dropdown-rel {
    a {
      color: #484848;
    }
  }
  .btn {
    width: 200px;
    border-radius: 20px;
    border: none;
    padding: 8px 0;
    color: #fff;
    background: $theme-green;
    box-shadow: 3px 3px 26px 0px rgba(45, 214, 170, 0.7);
  }
}
.reset {
  font-size: 16px;
  .ivu-btn-text {
    border: none;
    padding: 10px 0;
    font-size: 14px;
  }
}
</style>


