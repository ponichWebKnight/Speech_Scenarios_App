import {
  SET_TYPES_LIST,
  SET_ASSISTANT_LIST,
  SET_ZONES_LIST,
  SET_QUESTIONS_LIST,
  SET_CURRENT_ASSISTANT_ID,
  SET_CURRENT_QUESTION_ID,
  UPDATE_CURRENT_QUESTION_BUTTONS,
  ADD_PREVIOUS_STATE,
  DELETE_PREVIOUS_STATE,
  ASSISTANT_CHANGED,
  ASSISTANT_COMPLETED,
  DATA_LOADED,
  DATA_LOADING,
  SET_CURRENT_TYPE_ID,
  RESET_ASSISTANTS_LIST,
} from './mutation-types'

const mutations = {
  [SET_TYPES_LIST] (state, types) {
    state.types = types
  },
  [SET_ASSISTANT_LIST] (state, assistants) {
    state.assistants = assistants
  },
  [SET_ZONES_LIST] (state, zones) {
     state.zones = zones
  },
  [SET_QUESTIONS_LIST] (state, questions) {
    state.questions = questions
    //console.log(state.questions)
  },
  [SET_CURRENT_QUESTION_ID] (state, question_id) {
    state.current_question_id = question_id
  },
  [UPDATE_CURRENT_QUESTION_BUTTONS] (state, question_buttons) {
    state.current_question_buttons = question_buttons
  },
  [ADD_PREVIOUS_STATE] (state, previous_state) {
    state.previous_states.push(previous_state)
  },
  [DELETE_PREVIOUS_STATE] (state) {
    let next_state = state.previous_states.pop()
      console.log(next_state)
    state.current_question_id = next_state
  },
  [ASSISTANT_CHANGED] (state) {
    state.previous_states = []
  },
  [ASSISTANT_COMPLETED] (state) {
    state.previous_states = []
  },
  [DATA_LOADED] (state) {
    state.loaded = true
  },
  [DATA_LOADING] (state) {
    state.loaded = false
  },
  [SET_CURRENT_TYPE_ID] (state, type_id) {
    state.current_type_id = type_id
  },
  [SET_CURRENT_ASSISTANT_ID] (state, assistant_id) {
    state.current_assistant_id = assistant_id
  },
  [RESET_ASSISTANTS_LIST] (state) {
    state.assistants = []
  },
}

export default mutations