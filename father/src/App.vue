<template>
  <div id="app">
    <div id="nav">
      <router-link to="/app2">打开app2</router-link> |
      <router-link to="/app3">打开app3</router-link>
      
      <div id="micro2">
        <router-view></router-view>
      </div>
      <div id="micro3">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style>

</style>
