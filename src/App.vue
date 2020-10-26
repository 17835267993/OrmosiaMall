<template>
  <div id="app">
   
    <main-tabbar></main-tabbar>
    <keep-alive exclude="Detail">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import MainTabbar from 'components/content/mainTabbar/MainTabbar'


export default {
  name: 'App',
  components: {
    MainTabbar,
    
  }
}
</script>

<style>
@import 'assets/css/base.css';
main-tabbar {
  z-index: 9999999;
}
</style>
