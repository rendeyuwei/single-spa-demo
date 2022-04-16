import { registerApplication, start } from 'single-spa';
import './index.less';

// for angular subapp
// import 'zone.js';

/**
 * 主应用 **可以使用任意技术栈**
 * 以下分别是 React 和 Vue 的示例，可切换尝试
 */
// import render from './render/ReactRender';
import render from './render/VueRender'

/**
 * Step1 初始化应用（可选）
 */
render();

// 远程加载子应用
function createScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(script, firstScript)
  })
}

// 记载函数，返回一个 promise
function loadApp(url, globalVar, project) {
  // 支持远程加载子应用
  return async () => {
    if (project === 'vue') {
      await createScript(url + '/js/chunk-vendors.js')
      await createScript(url + '/js/app.js')
    } else if (project === 'react') {
      await createScript(url + `/${globalVar}.js`)
    }
    // 这里的return很重要，需要从这个全局对象中拿到子应用暴露出来的生命周期函数
    return window[globalVar]
  }
}

// 子应用列表
const apps = [
  {
    // 子应用名称
    name: 'app2',
    // 子应用加载函数，是一个promise
    app: loadApp('http://localhost:8082', 'app2', 'vue'),
    // 当路由满足条件时（返回true），激活（挂载）子应用
    activeWhen: location => location.pathname.startsWith('/app2'),
    // 传递给子应用的对象
    customProps: {}
  },
  {
    name: 'app1',
    app: System.import('@org-name/app1'),
    activeWhen: location => location.pathname.startsWith('/react16'),
    customProps: {}
  },
]

// 注册子应用
for (let i = apps.length - 1; i >= 0; i--) {
  registerApplication(apps[i])
}

start()

// new Vue({
// }).$mount('#app')