require('./bootstrap')

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'




Vue.use(BootstrapVue)

window.axios.defaults.baseURL = window.assistant_request_path

const vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

export default vm