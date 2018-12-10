const getters = {
  currentQuestion (state, getters) {
    if (state.current_question_id)
      return state.questions.find(question => question.id === state.current_question_id)
    else
      return {}
  },
  currentType (state, getters) {
    if (state.current_type_id)
      return state.types.find(type => type.id === state.current_type_id)
    else
      return {}
  },
  currentAssistant (state, getters) {
        return state.current_assistant_id
            ? state.assistants.find(assistant => assistant.id === state.current_assistant_id) : {}
  },
}

export default getters