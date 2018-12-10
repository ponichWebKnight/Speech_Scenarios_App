import { cloneDeep } from 'lodash'
import { ADD_PREVIOUS_STATE, QUESTION_READY } from './mutation-types'

const recordStates = (store) => {
  let prevState = cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = cloneDeep(state)
    if (mutation.type === QUESTION_READY) {
      store.commit(ADD_PREVIOUS_STATE, nextState)
    }
  })
}

const plugins = [recordStates]

export default plugins