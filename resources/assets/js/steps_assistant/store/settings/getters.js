const getters = {
  currentType (state, getters) {
    return state.current_type_id
      ? state.types.find(type => type.id === state.current_type_id)
      : {}
  },
  currentAssistant (state, getters) {
    return state.current_assistant_id
      ? state.assistants.find(type => type.id === state.current_assistant_id)
      : {}
  },
  currentQuestion (state, getters) {
    return state.current_question_id
      ? state.questions.find(type => type.id === state.current_question_id)
      : {}
  },
}

export default getters