<template>
  <div class="mainapp">
    <!-- 标题栏 -->
    <header class="mainapp-header">
      <h1>single-spa</h1>
    </header>
    <div class="mainapp-main">
      <!-- <router-link to="/app2">打开app2</router-link> |
      <router-link to="/app3">打开app3</router-link> |
      <router-link to="/about">About</router-link> -->

      <!-- 侧边栏 -->
      <ul class="mainapp-sidemenu">
        <li><router-link to="/app2">打开app2</router-link></li>
        <li><router-link to="/app3">打开app3</router-link></li>
      </ul>
      
      <div id="microApp">
        <router-view></router-view>
      </div>
      
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
}
.mainapp {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  line-height: 1;
}
.mainapp-header > h1 {
  color: #333;
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  padding: 36px;
}
.mainapp-main {
  display: flex;
}
.mainapp-main .mainapp-sidemenu {
  width: 130px;
  list-style: none;
  margin: 0;
  margin-left: 40px;
  padding: 0;
  border-right: 2px solid #aaa;
}
.mainapp-main .mainapp-sidemenu > li {
  color: #aaa;
  margin: 20px 0;
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
}
.mainapp-main .mainapp-sidemenu > li:hover {
  color: #444;
}
.mainapp-main .mainapp-sidemenu > li:first-child {
  margin-top: 5px;
}

#microApp {
  flex-grow: 1;
  position: relative;
  margin: 0 40px;
}
</style>
