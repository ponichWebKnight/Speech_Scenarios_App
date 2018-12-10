import Vue from 'vue'
import Vuex from 'vuex'
import settingsModule from './settings'
import moduleWidget from './widget'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    settings: settingsModule,
    widget: moduleWidget,
  }
})

export default store

