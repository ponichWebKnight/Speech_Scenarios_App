import Vue from 'vue'
import Vuex from 'vuex'
import settingsModule from './settings'
import moduleWidget from './widget'
import moduleLog from './log'
import statsModule from './stats'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    settings: settingsModule,
    widget: moduleWidget,
    log: moduleLog,
    stats: statsModule
  }
})

export default store

