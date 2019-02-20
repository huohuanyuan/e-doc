/*
 * @Author: chengshanshan 
 * @Date: 2018-07-23 14:05:59 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-08-28 15:15:58
 * @instruction：首次登录，修改密码页面
 */

<template>
    <div>
        <Form ref="loginForm" :label-width="80" :model="loginForm" :rules="loginFormRule">
            <FormItem :label="$t('title.userName')" prop="userName">
                <Input v-model="loginForm.userName" type="text"></Input>
            </FormItem>
            <FormItem :label="$t('title.password')" prop="password">
                <Input v-model="loginForm.password" type="password"></Input>
            </FormItem>
            <FormItem>
                <Button @click="login('loginForm')">{{$t('operation.login')}}</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { postLogin } from "@/api/api.js";
import md5 from "js-md5";
import Cookies from "js-cookie";
import { resCode } from "common/js/code";
export default {
  data() {
    return {
      loginFormRule: {
        userName: [{ required: true, message: " ", trigger: "blur" }],
        password: [{ required: true, message: " ", trigger: "blur" }]
      },
      loginForm: {
        userName: "",
        password: ""
      }
    };
  },
  methods: {
    login(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          postLogin({
            userName: this.loginForm.userName,
            password: md5(this.loginForm.password)
          }).then(function(res) {
            if (res.code == "success") {
              _this.$Message.success(this.$t('title.success'));
              Cookies.set("user",_this.loginForm.userName)
            } else {
              _this.$Message.error(resCode(_this, res.code));
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


