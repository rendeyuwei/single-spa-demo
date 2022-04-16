import Vue from 'vue'
import App from './App.vue'
import router from './router'
import singleSpaVue from 'single-spa-vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI);

const appOptions = {
  router,
  render: h => h(App),
  el: '#microApp' // 挂载到父应用的标签中
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
