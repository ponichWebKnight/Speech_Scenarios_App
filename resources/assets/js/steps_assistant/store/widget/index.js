import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'
import plugins from './plugins'

const moduleWidget = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
  plugins
}

export default moduleWidget