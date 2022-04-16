import Vue from 'vue/dist/vue.js'

function vueRender() {
  return new Vue({
    template: `
      <div id="microApp">
      </div>
    `,
    el: '#microApp',
    data() {
      return {
      };
    },
  });
}

let app = null;

export default function render() {
  app = vueRender();
}
