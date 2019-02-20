// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index'
import { router } from './router/index'
import 'common/css/index.scss';
Vue.config.productionTip = false

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './doc-theme/index.less';//引入iview自定义主题样式


import { Tree, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';

import VueI18n from "vue-i18n";
import en from 'iview/dist/locale/en-US';
import zh from 'iview/dist/locale/zh-CN';
import ja from 'iview/dist/locale/ja-JP';

import Cookies from "js-cookie";

Vue.use(Tree)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)



Vue.use(VueI18n)
Vue.locale = () => { };

const i18n = new VueI18n({
  locale: (() => {
    //获取cookie 语言
    let lang = "";
    if (Cookies.get("Lang")) {
      lang = Cookies.get("Lang");
    } else {
      //获取浏览器语言
      lang = navigator.language || navigator.userLanguage;
      lang = lang.substr(0, 2);
      if (!["zh", "en", "ja"].includes(lang)) {
        lang = "zh"
      }
    }
    return lang;
  })(),    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    zh: Object.assign(require('./lang/zh'), zh),  // 中文语言包
    en: Object.assign(require('./lang/en'), en),   // 英文语言包
    ja: Object.assign(require('./lang/ja'), ja),   // 日文语言包
  }
})
Vue.use(iView, {
  i18n: function (path, options) {
    let value = i18n.t(path, options);
    if (value !== null && value !== undefined) return value;

    return '';
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
});
