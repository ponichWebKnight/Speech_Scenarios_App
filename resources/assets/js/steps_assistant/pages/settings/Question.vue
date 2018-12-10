<template>
    <b-container v-if="loaded">
        <b-breadcrumb :items="breadcrumbs"/>
        <div v-if="current_assistant && current_type">
            <h4><strong>{{ current_type.name }} ({{ current_assistant.zone.name }})</strong></h4>
        </div>
        <div class="clearfix">
            <b-button size="sm" variant="success" class="float-right" v-b-modal.create_modal>
                <i class="fa fa-plus" aria-hidden="true"></i> Добавить вопрос
            </b-button>
        </div>

        <b-row v-if="questions && questions.length > 0">
            <b-table @row-clicked="rowClicked" hover :items="questions" :fields="fields">
                <template slot="index" slot-scope="data">
                    {{data.index + 1}}
                </template>
                <template slot="question" slot-scope="data">
                    {{ data.item.question }} <span v-if="data.item.first" class="badge badge-default">Первый</span>
                </template>
                <template slot="buttons" slot-scope="data">
                    <router-link :to="{ name: 'sa.settings.type.assistant.question.button.index',
                     params: {type_id: current_type.id, assistant_id: current_assistant.id, question_id: data.item.id}}">
                        <template>
                            <b-button variant="primary">
                                <i class="fa fa-eye" aria-hidden="true"></i> Кнопки
                            </b-button>
                        </template>
                    </router-link>
                    <router-link :to="{ name: 'sa.settings.type.assistant.question.infoblock.index',
                     params: {type_id: current_type.id, assistant_id: current_assistant.id, question_id: data.item.id}}">
                        <template>
                            <b-button variant="primary">
                                <i class="fa fa-eye" aria-hidden="true"></i> Инфоблоки
                            </b-button>
                        </template>
                    </router-link>
                    <b-button v-b-modal.delete_modal @click.stop="itemToDelete = data.item" variant="danger">
                        <i class="fa fa-trash-o" aria-hidden="true"></i> Удалить
                    </b-button>
                </template>
            </b-table>
        </b-row>
        <b-row v-else>
            <b-col xs="12">
                <b-alert show variant="warning">Вопросы отсутствуют</b-alert>
            </b-col>
        </b-row>
        <b-modal id="create_modal"
                 ref="create_modal"
                 title="Добавить вопрос"
                 @hidden="createdQuestion = ''"
                 @ok="createQuestion">
            <form @submit.stop.prevent="handleSubmit">
                <label>Текст вопроса:</label>
                <b-form-textarea id="question-textarea"
                                 v-model="createdQuestion"
                                 placeholder="Введите вопрос"
                                 :rows="3"
                                 :max-rows="6">
                </b-form-textarea>
            </form>
        </b-modal>
        <b-modal id="edit_modal"
                 ref="edit_modal"
                 title="Добавить вопрос"
                 @hidden="editedQuestion = {id: '', question: ''}"
                 @ok="editQuestion">
            <form @submit.stop.prevent="handleSubmit">
                <label>Текст вопроса:</label>
                <b-form-textarea id="question-textarea"
                                 v-model="editedQuestion.question"
                                 placeholder="Введите вопрос"
                                 :rows="3"
                                 :max-rows="6">
                </b-form-textarea>
            </form>
        </b-modal>
        <b-modal id="delete_modal"
                 ref="delete_modal"
                 title="Удалить вопрос"
                 header-bg-variant="warning"
                 @hidden="itemToDelete = {}"
                 @ok="deleteQuestion(itemToDelete)">
            <form @submit.stop.prevent="handleSubmit">
                <label>Вы уверены, что действительно хотите удалить этот вопрос?</label>
            </form>
        </b-modal>
    </b-container>
    <b-container v-else>
        <true-spinner :size="100" :speed="1"></true-spinner>
    </b-container>

</template>

<script>

  import { createNamespacedHelpers } from 'vuex'
  import { cloneDeep } from 'lodash'
  import {
    DATA_LOADED,
    DATA_LOADING,
    SET_CURRENT_TYPE_ID,
    SET_CURRENT_ASSISTANT_ID
  } from '../../store/settings/mutation-types'
  import TrueSpinner from '../../components/TrueSpinner'

  const {mapActions, mapState, mapMutations, mapGetters} = createNamespacedHelpers('settings')

  export default {
    name: 'questions',
    metaInfo: {
      title: 'Вопросы'
    },
    components: {
      TrueSpinner
    },
    data () {
      return {
        breadcrumbs: [{
          text: 'Назад',
          href: '#/'
        }, {
          text: 'Настройки',
          href: '#/settings'
        }, {
          text: 'Виды помощников',
          href: '#/settings/type'
        }, {
          text: 'Помощники',
          href: `#/settings/type/${this.$route.params.type_id}/assistant`
        }, {
          text: 'Вопросы',
          active: true
        }],
        fields: {
          index: {
            label: '#',
            sortable: true
          },
          question: {
            label: 'Текст',
            sortable: true
          },
          buttons: {
            label: 'Опции',
            sortable: false
          }
        },
        createdQuestion: '',
        editedQuestion: {id: '', question: ''}
      }
    },
    created () {
      this.dataLoading()
      this.setCurrentTypeId(parseInt(this.$route.params.type_id))
      this.setCurrentAssistantId(parseInt(this.$route.params.assistant_id))
    },
    mounted () {
      this.fetchTypes()
        .then(() => this.fetchAssistants(this.current_type))
        .then(() => this.fetchQuestions({type: this.current_type, assistant: this.current_assistant}))
        .then(() => this.dataLoaded())
    },
    methods: {
      ...mapActions([
        'fetchTypes',
        'fetchAssistants',
        'fetchQuestions',
        'storeQuestion',
        'removeQuestion',
        'updateQuestion',
      ]),
      ...mapMutations({
        dataLoaded: DATA_LOADED,
        dataLoading: DATA_LOADING,
        setCurrentTypeId: SET_CURRENT_TYPE_ID,
        setCurrentAssistantId: SET_CURRENT_ASSISTANT_ID,
      }),
      createQuestion () {
        this.dataLoading()
        this.storeQuestion({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.createdQuestion
        })
          .then(() => this.fetchQuestions({type: this.current_type, assistant: this.current_assistant}))
          .then(() => this.dataLoaded())
      },
      deleteQuestion (question) {
        this.dataLoading()
        this.removeQuestion({
          type: this.current_type,
          assistant: this.current_assistant,
          question: question
        })
          .then(() => this.fetchQuestions({type: this.current_type, assistant: this.current_assistant}))
          .then(() => this.dataLoaded())
      },
      editQuestion () {
        this.dataLoading()
        this.updateQuestion({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.editedQuestion
        })
          .then(() => this.fetchQuestions({type: this.current_type, assistant: this.current_assistant}))
          .then(() => this.dataLoaded())
      },
      rowClicked (item) {
        this.editedQuestion = cloneDeep(item)
        this.$refs.edit_modal.show()
      },
    },
    computed: {
      ...mapState([
        'loaded',
        'questions',
      ]),
      ...mapGetters({
        current_type: 'currentType',
        current_assistant: 'currentAssistant',
      }),
    }

  }
</script>

<style>


</style>
