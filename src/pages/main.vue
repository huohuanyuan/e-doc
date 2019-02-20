<template>

    <Layout :style="{height:'100%'}">

          <doc-header></doc-header>   
        <Layout :style="{background: '#F9F9F9',padding:'10px',height:'100%'}">
            <Sider hide-trigger  :style="{background: '#F9F9F9'}" :width="150">
              <doc-slider :menu-list="menuList"></doc-slider>
            </Sider>
            <Content  :style="{background: '#F9F9F9',height:'100%'}">
              <div class="main-content">
                  <router-view></router-view>
              </div>
               
            </Content>
        </Layout>
    </Layout>
</template>

<script>
import DocHeader from "components/doc-header";
import DocSlider from "components/doc-slider";

export default {
  name: "App",
  components: {
    DocHeader,
    DocSlider
  },
  computed:{
    menuList() {
      return JSON.parse(localStorage.getItem("menuList"));
    },
  },
  created(){
    //检查本地是否已有token
    if(!sessionStorage['token']){
      this.$router.push({name:"login"})
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common/css/variable.scss";
.main-content{
  height: 100%;
  min-width: 900px;
  width: 100%;
  overflow-x: auto;
}
</style>

