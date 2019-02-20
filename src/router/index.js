import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  routers
} from './router';
import Util from 'common/js/util';


Vue.use(VueRouter)

export const router = new VueRouter({
  mode: 'history',
  routes: routers
});
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要权限   
    if (!sessionStorage['token'] && to.name !== 'login') { //当前未登录且前往的不是登录页面,跳转登录页面
      next({
        name: 'login'
      })
    } else if (sessionStorage['token'] && to.name === 'login') { //当前已登录且前往的是登录页面，跳转首页
      next({
        name: 'home'
      })
    } else if (sessionStorage['token'] && to.name === "homePage") { // 当前已登录且前往的是 homepage页面
      next();
    } else if (sessionStorage['token'] && to.name === "admin") { // 当前已登录且前往的是admin
      next();
    } else {
      let priList = JSON.parse(localStorage.getItem("priList")) ? JSON.parse(localStorage.getItem("priList")) : [];
      //判断是否有子页面，如果有则默认跳转到第一个子页面
      if (priList.includes(to.name)) { //如果有权限跳转此页面
        Util.toDefaultPage(to.name, next);
      } else {
        next({
          replace: true,
          name: 'error404'
        });
      }
    }
  } else {
    next();
  };
  if (to.matched.length === 0) { //如果未匹配到路由
    from.name ? next({
      name: from.name
    }) : next('/'); //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
  }

})