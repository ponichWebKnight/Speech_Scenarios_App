<template>
    <b-container v-if="loaded">
        <b-breadcrumb :items="breadcrumbs"/>
        <div v-if="current_assistant && current_type">
            <h4><strong>{{ current_type.name }} ({{ current_assistant.zone.name }})</strong></h4>
        </div>
        <div class="clearfix">
            <b-button size="sm" variant="success" class="float-right create-button" @click="createButtonClicked">
                <i class="fa fa-plus" aria-hidden="true"></i> Добавить Инфоблок
            </b-button>
        </div>

        <b-row v-if="infoblocks && infoblocks.length > 0">
            <b-table @row-clicked="rowClicked" hover :items="infoblocks" :fields="fields">
                <template slot="buttons" slot-scope="data">
                    <b-button v-b-modal.delete_modal @click.stop.prevent="itemToDelete = data.item" variant="danger">
                        <i class="fa fa-trash-o" aria-hidden="true"></i> Удалить
                    </b-button>
                </template>
            </b-table>
        </b-row>
        <b-row v-else>
            <b-col xs="12">
                <b-alert show variant="warning">Инфоблоки отсутствуют</b-alert>
            </b-col>
        </b-row>
        <b-modal id="create_modal"
                 ref="create_modal"
                 title="Добавить инфоблок"
                 @hidden="createdInfoblock = {name: '', place_up: false, show_name: false, text: ''}"
                 @ok="handleCreateOk">
            <form @submit.stop.prevent="handleSubmit">
                <label>Наименование:</label>
                <b-form-input type="text" v-model="createdInfoblock.name"></b-form-input>
                <b-form-checkbox v-model="createdInfoblock.place_up" :value=1 :unchecked-value=0>
                    <label>Показывать инфоблок сверху</label>
                </b-form-checkbox>
                <b-form-checkbox v-model="createdInfoblock.show_name" :value=1 :unchecked-value=0>
                    <label>Не показывать имя инфоблока</label>
                </b-form-checkbox>
                <markdown-editor v-model="createdInfoblock.text" :configs="mde_configs"
                                 ref="markdownEditorCreate"></markdown-editor>
            </form>
        </b-modal>
        <b-modal id="edit_modal"
                 ref="edit_modal"
                 title="Изменить инфоблок"
                 @hidden="editedInfoblock = {name: '', place_up: false, show_name: false, text: ''}"
                 @ok="handleEditOk">
            <form @submit.stop.prevent="handleSubmit">
                <label>Наименование:</label>
                <b-form-input type="text" v-model="editedInfoblock.name"></b-form-input>
                <b-form-checkbox v-model="editedInfoblock.place_up" :value=1 :unchecked-value=0>
                    <label>Показывать инфоблок сверху</label>
                </b-form-checkbox>
                <b-form-checkbox v-model="editedInfoblock.show_name" :value=1 :unchecked-value=0>
                    <label>Не показывать имя инфоблока</label>
                </b-form-checkbox>
                <markdown-editor v-model="editedInfoblock.text" :configs="mde_configs"
                                 ref="markdownEditorEdit"></markdown-editor>
            </form>
        </b-modal>
        <b-modal id="delete_modal"
                 ref="delete_modal"
                 title="Удалить инфоблок"
                 header-bg-variant="warning"
                 @hidden="itemToDelete = {}"
                 @ok="deleteInfoblock(itemToDelete)">
            <form @submit.stop.prevent="handleSubmit">
                <label>Вы уверены, что действительно хотите удалить этот инфоблок?</label>
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
  import markdownEditor from 'vue-simplemde/src/markdown-editor'

  const {mapActions, mapState, mapMutations, mapGetters} = createNamespacedHelpers('settings')

  export default {
    name: 'infoblock',
    metaInfo: {
      title: 'Инфоблоки'
    },
    components: {
      TrueSpinner,
        markdownEditor,
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
              text: 'Инфоблоки',
              active: true
          }],
          fields: {
              id: {
                  label: '#',
                  sortable: true
              },
              name: {
                  label: 'Название',
                  sortable: true
              },
              buttons: {
                  label: 'Опции',
                  sortable: false
              }
          },
          createdInfoblock: {name: '', place_up: false, show_name: false, text: ''},
          editedInfoblock: {name: '', place_up: false, show_name: false, text: ''},
          editorConf: {},
          mde_configs: {
              status: false,
              spellChecker: false,
              insertTexts: {
                  horizontalRule: ['', '\n\n-----\n\n'],
                  image: ['![](https://', ')'],
                  link: ['[', '](https://)'],
                  table: ['', '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n']
              },
          },
          infoBlockButton: {
              btnName: '',
              btnURL: '',
          },
          tempText: '',
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
        .then(() => this.fetchInfoblocks({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.current_question
        }))
        .then(() => this.dataLoaded())

    },
    methods: {
      ...mapActions([
        'fetchTypes',
        'fetchAssistants',
        'fetchQuestions',
        'fetchButtons',
        'fetchInfoblocks',
        'removeInfoblock',
        'storeInfoblock',
        'updateInfoblock',
      ]),
      ...mapMutations({
        dataLoaded: DATA_LOADED,
        dataLoading: DATA_LOADING,
        setCurrentTypeId: SET_CURRENT_TYPE_ID,
        setCurrentAssistantId: SET_CURRENT_ASSISTANT_ID,
        setCurrentQuestionId: SET_CURRENT_QUESTION_ID,
        updateButtonsOrder: UPDATE_BUTTONS_ORDER,
      }),
      rowClicked (infoblock) {
        this.editedInfoblock = {...infoblock}
        this.infoBlockButtonURL = ''
        this.$refs.edit_modal.show()
        setTimeout(() => {
            this.$refs.markdownEditorEdit.simplemde.codemirror.refresh()
        }, 2)
      },
      createButtonClicked () {
        this.createdInfoblock = {name: '', place_up: false, show_name: false, text: ''}
        this.$refs.create_modal.show()
        setTimeout(() => {
            this.$refs.markdownEditorCreate.simplemde.codemirror.refresh()
        }, 2)
      },
      deleteInfoblock (infoblock) {
        this.dataLoading()
        this.removeInfoblock({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.current_question,
          infoblock
        })
          .then(() => this.fetchInfoblocks({
            type: this.current_type,
            assistant: this.current_assistant,
            question: this.current_question
          }))
          .then(() => this.dataLoaded())
      },
      createInfoblock () {
        this.dataLoading()
          console.log(this.createdInfoblock)
        this.storeInfoblock({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.current_question,
          infoblock: this.createdInfoblock
        })
          .then(() => this.fetchInfoblocks({
            type: this.current_type,
            assistant: this.current_assistant,
            question: this.current_question
          }))
          .then(() => this.dataLoaded())
      },
      editInfoblock () {
        this.dataLoading()
        this.updateInfoblock({
          type: this.current_type,
          assistant: this.current_assistant,
          question: this.current_question,
          infoblock: this.editedInfoblock
        })
          .then(() => this.fetchInfoblocks({
            type: this.current_type,
            assistant: this.current_assistant,
            question: this.current_question
          }))
          .then(() => this.dataLoaded())
      },
      handleCreateOk (evt) {
        // Prevent modal from closing
        evt.preventDefault()
        console.log(this.createdInfoblock.name)
        if (!this.createdInfoblock.name) {
            alert('Please infoblock name!')
        } else {
            this.createInfoblock()
        }
      },
      handleEditOk (evt) {
        // Prevent modal from closing
        evt.preventDefault()
        if (!this.editedInfoblock.name) {
            alert('Please infoblock name!')
        } else {
            this.editInfoblock()
        }
      },
    },
    computed: {
      ...mapState([
        'loaded',
        'infoblocks',
      ]),
      ...mapGetters({
        current_type: 'currentType',
        current_assistant: 'currentAssistant',
        current_question: 'currentQuestion',
      }),
    }

  }
</script>

<style scoped>
    @import '~simplemde/dist/simplemde.min.css';

    #edit_modal {
        overflow: hidden;
    }

    #addToInfoBlockBtn {
        padding-bottom: 10px;
    }
</style>

