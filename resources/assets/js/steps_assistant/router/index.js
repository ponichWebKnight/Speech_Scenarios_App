import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import widget_routes from './widget'
import settings_routes from './settings'
import other_routes from './other'

Vue.use(Router)
Vue.use(Meta)


const routes = ((widget_routes.concat(settings_routes)).concat(other_routes));

export default new Router({
  // mode: 'history',
  base: window.location.pathname,
  linkActiveClass: 'active',
  routes
})


