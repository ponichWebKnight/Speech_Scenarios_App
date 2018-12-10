import axios from 'axios'
import {
  SET_TYPES_LIST,
  SET_ASSISTANT_LIST,
  SET_QUESTIONS_LIST,
  SET_CURRENT_QUESTION_ID,
  UPDATE_CURRENT_QUESTION_BUTTONS,
  ASSISTANT_CHANGED,
} from './mutation-types'

const actions = {
  fetchTypes ({commit}) {
    return axios.get(route('sa.widget.type.index'))
      .then((response) => {
        commit(SET_TYPES_LIST, response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  fetchAssistants ({commit}, type) {
    return axios.get(route('sa.widget.type.actives', {type: type.id}))
      .then((response) => {
          commit(SET_ASSISTANT_LIST, response.data)
          console.log(response.data)
      })
      .catch(function (error) {
         console.log(error)
      })
  },
  fetchQuestions ({commit}, {type, assistant}) {
    commit(ASSISTANT_CHANGED)
    return axios.get(route('sa.widget.type.question_index', {type: type.id, assistant: assistant.id}))
      .then((response) => {
        commit(SET_QUESTIONS_LIST, response.data)
        let is_first_set = false
          console.log(response.data)
        response.data.some(function (question) {
          if (question.first) {
            commit(SET_CURRENT_QUESTION_ID, question.id)
            is_first_set = true
            return 1
          }
        })
        if (!is_first_set) {
          commit(SET_CURRENT_QUESTION_ID, response.data[0].id)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  fetchQuestionButtons ({commit}, { type, assistant, question }) {
    return axios.get(route('sa.widget.type.question.button.index', {type: type.id, assistant: assistant.id, question: question.id}))
      .then((response) => {
        commit(UPDATE_CURRENT_QUESTION_BUTTONS, response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
}

export default actions