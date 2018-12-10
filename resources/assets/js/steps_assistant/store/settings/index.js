import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'
import plugins from './plugins'

const settingsModule = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
  plugins
}

export default settingsModule