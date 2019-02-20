/*
 * @Author: chengshanshan 
 * @Date: 2018-07-20 09:37:36 
 * @Last Modified by: chengshanshan
 * @Last Modified time: 2018-09-17 14:39:22
 * @instranction:页头
 */
<template>
  <div class="doc-header">
    <div class="logo-wrapper">
      <img src="/static/edoc-icon.png" alt="">
      <div class="text">
        <p>{{$t('title.eDoc')}}</p>
        <p>{{$t('title.system')}}</p>
      </div>
    </div>
    <div class="div-name">
      <span> {{ studyName }} </span>
      <span> {{ siteName }} </span>
    </div>
    <ul class="list">
      <li class="header-menu" v-if="searchShow">
        <div class="input-wrapper">
          <input v-model.trim="searchVal" @keyup.enter="onClickSearch" style="width: 300px" v-focus="focusStatus" icon="search" @blur="onBlurFun" autofocus="autofocus"> </input>
          <Icon type="search" @click="onClickFun"></Icon>
        </div>
      </li>
      <li class="header-menu" v-else @click="onClickSearch">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-sousuo"></use>
        </svg>
      </li>
      <li class="header-menu">
        <Dropdown @on-click="langChange">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yuyan"></use>
          </svg>
          <DropdownMenu slot="list">
            <DropdownItem name="zh">中文</DropdownItem>
            <DropdownItem name="en">English</DropdownItem>
            <DropdownItem name="ja">日本語</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li>
      <li class="header-menu">
        <Poptip :title="tle" placement="bottom" width="320" trigger="hover" v-html="">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gonggao"></use>
          </svg>
          <div class="api" slot="content" v-html="content">
          </div>
        </Poptip>
      </li>
      <li class="header-menu" @click="readme">

        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-bangzhu"></use>
        </svg>

      </li>
      <li class="header-menu">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-touxiang"></use>
        </svg>
        <Dropdown trigger="click" @on-click="handleClickUserDropdown">
          <a href="javascript:void(0)">
            <span class="main-user-name"> {{ name }} </span>
            <Icon type="arrow-down-b"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="ownSpace">{{$t('page.personal')}}</DropdownItem>
            <DropdownItem name="loginout" divided>{{$t('operation.logOut')}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>

      </li>
    </ul>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { ApiGetNotice } from "@/api/manage/notice-manage-api";
import { putLangChange } from "@/api/api";
import { resCode } from "common/js/code";
export default {
  data() {
    return {
      searchShow: false,
      searchVal: "",
      focusStatus: true,
      tle: " ",
      content: ""
    };
  },
  // 自定义指令
  directives: {
    focus: {
      inserted: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  },
  methods: {
    handleClickUserDropdown(name) {
      if (name === "ownSpace") {
        this.$router.push({ path: "/ownspace" });
      } else if (name === "loginout") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("siteId");
        sessionStorage.removeItem("studyId");
        sessionStorage.removeItem("menuList");
        this.$router.push({ name: "login" });
      }
    },
    // 点击出现搜索
    onClickSearch() {
      this.searchShow = !this.searchShow;
    },
    onBlurFun() {
      if (this.searchVal == "") {
        this.searchShow = !this.searchShow;
      } else {
        this.onClickFun();
      }
    },
    onClickFun() {
      if (this.searchVal != "") {
        this.$router.push({
          name: "searchView",
          query: {
            searchMessage: this.searchVal,
            t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
          }
        });
        this.searchShow = !this.searchShow;
      }
    },
    // 请求公告
    getNotice() {
      ApiGetNotice().then(res => {
        if (res.code == "success") {
          if (res.data != null) {
            this.tle = res.data.noticeTittle;
            this.content = res.data.noticeContent;
          } else {
            this.tle = "";
            this.content = this.$t("note.noNote");
          }
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //切换语言
    langChange(lang) {
      putLangChange(lang).then(res => {
        if (res.code == "success") {
          this.$i18n.locale = lang;
          Cookies.set("Lang", lang);
          location.reload();
        } else {
          this.$Message.error(resCode(this, res.code));
        }
      });
    },
    //查看帮助文档
    readme() {
      const { href } = this.$router.resolve({
        path: "/help"
      });
      window.open(href, "_blank");
    }
  },
  computed: {
    name() {
      return sessionStorage.getItem("name");
    },
    studyName() {
      let studyName = this.$store.state.studyName;
      if (studyName) {
        return studyName;
      } else {
        return sessionStorage.getItem("studyName");
      }
    },
    siteName() {
      let siteName = this.$store.state.siteName;
      if (siteName) {
        return siteName;
      } else {
        return sessionStorage.getItem("siteName");
      }
    }
  },
  mounted() {
    this.getNotice();
  }
};
</script>

<style lang="scss">
@import "../common/css/variable.scss";
.doc-header {
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
  .div-name {
    line-height: 58px;
    span {
      max-width: 300px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      float: left;
      margin: 0 5px;
    }
  }
  .list {
    display: flex;
    align-items: center;
    .main-user-name {
      margin-left: 5px;
    }
    .header-menu {
      margin-right: 10px;
      cursor: pointer;
      .icon {
        font-size: 25px;
      }
    }
  }

  .input-wrapper {
    display: inline-block;
    width: 300px;
    position: relative;
    vertical-align: middle;
    line-height: normal;
    input {
      display: inline-block;
      width: 100%;
      height: 32px;
      line-height: 1.5;
      padding: 4px 7px;
      font-size: 13px;
      border: 1px solid #dddee1;
      border-radius: 4px;
      color: #495060;
      background-color: #fff;
      background-image: none;
      position: relative;
      cursor: text;
    }
    input:focus {
      border-color: #57debb;
      outline: 0;
    }
    .ivu-icon {
      width: 32px;
      height: 32px;
      line-height: 32px;
      font-size: 24px;
      text-align: center;
      color: #80848f;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 3;
    }
  }
}
</style>

