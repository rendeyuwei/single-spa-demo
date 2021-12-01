import Vue from 'vue'
import App from './App.vue'
import router from './router'
import singleSpaVue from 'single-spa-vue'

Vue.config.productionTip = false

const appOptions = {
  router,
  render: h => h(App),
  el: '#micro2' // 挂载到父应用的标签中
}

const vueLifecycle =  singleSpaVue({
  Vue,
  appOptions
})

// 如果不是父应用引用我，作为独立项目进行运行
if(!window.singleSpaNavigate){
  delete appOptions.el
  new Vue(appOptions).$mount('#app')
}

export const bootstrap = vueLifecycle.bootstrap
export const mount = vueLifecycle.mount
export const unmount = vueLifecycle.unmount
