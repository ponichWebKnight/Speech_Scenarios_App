<template>
    <b-container v-if="loaded">
        <b-breadcrumb :items="breadcrumbs"/>
        <div v-if="current_assistant && current_type">
            <h4><strong>{{ current_type.name }} ({{ current_assistant.zone.name }})</strong></h4>
        </div>
        <div class="clearfix">
            <b-button size="sm" variant="success" class="float-right create-button" v-b-modal.create_modal>
                <i class="fa fa-plus" aria-hidden="true"></i> Добавить Кнопку
            </b-button>
        </div>
        <b-card title="Текст вопроса:"
                tag="article"
                class="xs-12">
            <p class="card-text" v-if="current_question">
                {{ current_question.question }}
            </p>
            <div v-if="buttons && buttons.length > 0">
                <b-list-group class="buttons-list">
                    <draggable v-model="buttons" class="buttons-list">
                        <b-list-group-item v-for="button in buttons" :key="button.id">
                            <b-button @click="editedButton = button, buttonClicked(button)" variant="">
                                {{ button.name }}
                            </b-button>
                            <b-button v-b-modal.delete_modal @click.stop="itemToDelete = button" variant="danger">
                                <i class="fa fa-trash-o" aria-hidden="true"></i> Удалить
                            </b-button>
                        </b-list-group-item>
                    </draggable>
                </b-list-group>
            </div>
            <div class="card-text" v-else>
                <b-alert show variant="warning">Кнопки отсутствуют</b-alert>
            </div>
        </b-card>
        <b-button @click="saveButtonsOrder" variant="primary" v-if="isButtonOrderChanged">
            <i class="fa fa-save-o" aria-hidden="true"></i> Сохранить сортировку
        </b-button>
        <b-row>
        </b-row>
        <b-modal id="create_modal"
                 ref="create_modal"
                 title="Добавить кнопку"
                 @hidden="createdButton = {name: '', next_question_id: null}"
                 @ok="createButton">
            <form @submit.stop.prevent="handleSubmit">
                <label>Наименование:</label>
                <b-form-input type="text"
                              v-model="createdButton.name">
                </b-form-input>
                <label>При клике открывать вопрос:</label>
                <b-form-select v-model="createdButton.next_question_id" :options="questionsOption" class="mb-3">
                </b-form-select>
            </form>
        </b-modal>
        <b-modal id="edit_modal"
                 ref="edit_modal"
                 title="Изменить кнопку"
                 @hidden="editedButton = {name: '', next_question_id: null}"
                 @ok="editButton">
            <form @submit.stop.prevent="handleSubmit">
                <label>Наименование:</label>
                <b-form-input type="text"
                              v-model="editedButton.name">
                </b-form-input>
                <label>При клике открывать вопрос:</label>
                <b-form-select v-model="editedButton.next_question_id" :options="questionsOption" class="mb-3">
                </b-form-select>
            </form>
        </b-modal>
        <b-modal id="delete_modal"
                 ref="delete_modal"
                 title="Удаление кнопки"
                 header-bg-variant="warning"
                 @hidden="itemToDelete = {}"
                 @ok="deleteButton(itemToDelete)">
            <form @submit.stop.prevent="handleSubmit">
                <label>Вы уверены, что действительно хотите удалить эту кнопку?</label>
            </form>
        </b-modal>
    </b-container>
    <b-container v-else>
        <true-spinner :size="100" :speed="1"></true-spinner>
    </b-container>

</template>

<script>

  import { createNamespacedHelpers } from 'vuex'
  import {
    DATA_LOADED,
    DATA_LOADING,
    SET_CURRENT_TYPE_ID,
    SET_CURRENT_ASSISTANT_ID,
    SET_CURRENT_QUESTION_ID,
    UPDATE_BUTTONS_ORDER
  } from '../../store/settings/mutation-types'
  import TrueSpinner from '../../components/TrueSpinner'
  import draggable from 'vuedraggable'

  const {mapActions, mapState, mapMutations, mapGetters} = createNamespacedHelpers('settings')

  export default {
    name: 'questions',
    metaInfo: {
      title: 'Вопросы'
    },
    components: {
      TrueSpinner,
      draggable
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
          href: `#/settings/type/${this.$route.params.type_id}/assistant/${this.$route.params.assistant_id}/question`
        }, {
          text: 'Кнопки',
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
            label: '',
            sortable: false
          }
        },
        createdButton: {name: '', next_question_id: null},
        editedButton: {name: '', next_question_id: null},
        isButtonOrderChanged: false
      }
    },
    created () {
      this.dataLoading()
      this.setCurrentTypeId(parseInt(this.$route.params.type_id))
      this.setCurrentAssistantId(parseInt(this.$route.params.assistant_id))
      this.setCurrentQuestionId(parseInt(this.$route.params.question_id))
    },
    mounted () {
      this.fetchTypes()
        .then(() => this.fetchAssistants(this.current_type))
        .then(() => this.fetchQuestions({type: this.current_type, assistant: this.current_assistant}))
        .then(() => this.fetchButtons({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.current_question
        }))
        .then(() => this.fetchEvents(this.current_assistant.city_id))
        .then(() => this.dataLoaded())
    },
    methods: {
      ...mapActions([
        'fetchTypes',
        'fetchAssistants',
        'fetchQuestions',
        'fetchButtons',
        'storeButton',
        'removeButton',
        'storeButtonOrder',
        'updateButton',
      ]),
      ...mapMutations({
        dataLoaded: DATA_LOADED,
        dataLoading: DATA_LOADING,
        setCurrentTypeId: SET_CURRENT_TYPE_ID,
        setCurrentAssistantId: SET_CURRENT_ASSISTANT_ID,
        setCurrentQuestionId: SET_CURRENT_QUESTION_ID,
        updateButtonsOrder: UPDATE_BUTTONS_ORDER,
      }),
      createButton () {
        this.dataLoading()
        this.storeButton({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.current_question,
          button: this.createdButton
        })
          .then(() => this.fetchButtons({
            type: this.current_type,
            assistant: this.current_assistant,
            question: this.current_question
          }))
          .then(() => this.dataLoaded())
        this.createdButton = {name: '', next_question_id: null}
      },
      buttonClicked(button) {
        this.editedButton = {...button};
        this.$refs.edit_modal.show();
      },
      editButton () {
        this.dataLoading()
        this.updateButton({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.current_question,
          button: this.editedButton
        })
          .then(() => this.fetchButtons({
            type: this.current_type,
            assistant: this.current_assistant,
            question: this.current_question
          }))
          .then(() => this.dataLoaded())
      },
      deleteButton (button) {
        this.dataLoading()
        this.removeButton({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.current_question,
          button
          })
          .then(() => this.fetchButtons({
            type: this.current_type,
            assistant: this.current_assistant,
            question: this.current_question
          }))
          .then(() => this.dataLoaded())
      },
      saveButtonsOrder () {
        this.storeButtonOrder({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.current_question,
          buttons: this.buttons
        })
          .then(() => this.isButtonOrderChanged = false)
      }
    },
    computed: {
      ...mapState([
        'loaded',
        'questions',
      ]),
      ...mapGetters({
        current_type: 'currentType',
        current_assistant: 'currentAssistant',
        current_question: 'currentQuestion',
      }),
      buttons: {
        get () {
          return this.$store.state.settings.buttons
        },
        set (buttons) {
          this.isButtonOrderChanged = true
          this.updateButtonsOrder(buttons)
        }
      },
      questionsOption () {
        return this.questions.map((question) => {
          return {value: question.id, text: question.question}
        })
      }
    }

  }
</script>

<style scoped>
    .create-button {
        margin-top: 10px;
    }

    .buttons-list {
        width: 100%;
    }

    .card {
        padding: 0px;
    }

    .card-title, .card-text {
        margin: 30px;
    }
</style>

