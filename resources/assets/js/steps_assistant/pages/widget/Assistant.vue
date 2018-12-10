<template>
    <b-container v-if="loaded">
        <b-row align-h="center" align-v="center">
            <b-col style="padding-top: 15px">
                <b-btn id="btn-custom" size="sm" variant="primary" @click="backClicked" v-if="previous_states.length > 0">Назад на вопрос</b-btn>
                <b-btn id="btn-custom" size="sm" variant="info" @click="backToList">Назад к списку</b-btn>
            </b-col>
        </b-row>
        <b-row align-h="center" align-v="center"
               sm="6" md="6" lg="3" xl="3"
               v-if="upperBlocks && upperBlocks.length > 0">
            <b-col class="upper-pad">
                <b-card-group deck v-if="upperBlocks.length < 4">
                    <infoblock v-for="infoblock in upperBlocks"
                               :key="infoblock.id"
                               :name="infoblock.name"
                               :show_name="infoblock.show_name"
                               :text="infoblock.text">
                    </infoblock>
                </b-card-group>
                <b-card-group columns v-else>
                    <infoblock v-for="infoblock in upperBlocks"
                               :key="infoblock.id"
                               :name="infoblock.name"
                               :show_name="infoblock.show_name"
                               :text="infoblock.text">
                    </infoblock>
                </b-card-group>
            </b-col>
        </b-row>
        <b-row align-h="center" align-v="center">
            <question class="upper-pad" :title="current_question.question"
                      :buttons="current_question_buttons"
                      @buttonPressed="buttonPressed">
            </question>
        </b-row>
        <b-row align-h="center" align-v="center"
               sm="6" md="6" lg="3" xl="3"
               v-if="bottomBlocks && bottomBlocks.length > 0">
            <b-col class="bottom-pad">
                <b-card-group deck v-if="bottomBlocks.length < 4">
                    <infoblock v-for="infoblock in bottomBlocks"
                               :key="infoblock.id"
                               :name="infoblock.name"
                               :show_name="infoblock.show_name"
                               :text="infoblock.text">
                    </infoblock>
                </b-card-group>
                <b-card-group columns v-else>
                    <infoblock v-for="infoblock in bottomBlocks"
                               :key="infoblock.id"
                               :name="infoblock.name"
                               :show_name="infoblock.show_name"
                               :text="infoblock.text">
                    </infoblock>
                </b-card-group>
            </b-col>
        </b-row>
    </b-container>
    <b-container v-else>
        <spinner message="Загрузка..." :size="55" :line-size="7"></spinner>
    </b-container>
</template>

<script>
  import axios from 'axios'
  import router from '../../router'
  import { createNamespacedHelpers } from 'vuex'
  import {
    SET_CURRENT_QUESTION_ID,
    REMOVE_ASSISTANT_OPTION,
    ADD_PREVIOUS_STATE,
    DELETE_PREVIOUS_STATE,
    DATA_LOADED,
    DATA_LOADING,
    SET_CURRENT_TYPE_ID,
    SET_CURRENT_ASSISTANT_ID,
  } from '../../store/widget/mutation-types'
  import VueMarkdown from 'vue-markdown'
  import Spinner from 'vue-simple-spinner'
  import Infoblock from '../../components/Infoblock'
  import Question from '../../components/Question'

  const {mapActions, mapState, mapMutations, mapGetters} = createNamespacedHelpers('widget')

  export default {
    name: 'assistant',
    metaInfo() {
        return {
            title: this.title
        }
    },
    components: {
        Checkbox,
        Infoblock,
        Question,
        Spinner
    },
    data () {
      return {
        title: '',
        ready: false,
        upperBlocks: [],
        bottomBlocks: [],
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
            .then(() => this.fetchQuestionButtons({type: this.current_type, assistant: this.current_assistant, question: this.current_question}))
            .then(() => this.infoblockToUpCheck())
            .then(() => this.dataLoaded())
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchDataAgain'
    },
    methods: {
      ...mapActions([
        'fetchTypes',
        'fetchAssistants',
        'fetchQuestions',
        'fetchQuestionButtons',
      ]),
      ...mapMutations({
        setCurrentTypeId: SET_CURRENT_TYPE_ID,
        setCurrentAssistantId: SET_CURRENT_ASSISTANT_ID,
        setCurrentQuestionId: SET_CURRENT_QUESTION_ID,
        removeAssistantOption: REMOVE_ASSISTANT_OPTION,
        addPreviousState: ADD_PREVIOUS_STATE,
        rewindState: DELETE_PREVIOUS_STATE,
        dataLoaded: DATA_LOADED,
        dataLoading: DATA_LOADING,
      }),
      infoblockToUpCheck () {
          this.upperBlocks = []
          this.bottomBlocks = []
          this.current_question.infoblocks.forEach(infoblock => {
              infoblock.place_up === 1 ? this.upperBlocks.push(infoblock) : this.bottomBlocks.push(infoblock)
          })
          this.title = this.current_type.name
      },
      buttonPressed (button) {
        this.dataLoading()

        if (button.next_question_id == 0 || button.next_question_id == null) {
                this.closeWizard()
        }
        this.setCurrentQuestionId(button.next_question_id)
        this.addPreviousState(button.question_id)

        this.infoblockToUpCheck()

        this.fetchQuestionButtons({type: this.current_type, assistant: this.current_assistant, question: this.current_question})
          .then(() => this.dataLoaded())
      },
      backClicked () {
        this.dataLoading()
        this.rewindState()

        this.infoblockToUpCheck()

        //this.setCurrentQuestionId(button.next_question_id)

        this.fetchQuestionButtons({type: this.current_type, assistant: this.current_assistant, question: this.current_question})
          .then(() => this.dataLoaded())
      },
      backToList () {
          this.$router.push({ name: 'sa.widget.index'})
      },
      closeWizard() {
          window.close()
      },
      fetchDataAgain() {
          this.dataLoading()
          this.setCurrentTypeId(parseInt(this.$route.params.type_id))
          this.setCurrentAssistantId(parseInt(this.$route.params.assistant_id))


          setTimeout(() => {
              this.fetchTypes()
                  .then(() => this.fetchAssistants(this.current_type))
                  .then(() => this.fetchQuestions({type: this.current_type, assistant: this.current_assistant}))
                  .then(() => this.fetchQuestionButtons({type: this.current_type, assistant: this.current_assistant, question: this.current_question}))
                  .then(() => this.infoblockToUpCheck())
                  .then(() => this.dataLoaded())
          }, 2000)

      },
    },
    computed: {
      ...mapState([
        'questions',
        'current_question_id',
        'current_assistant_id',
        'current_question_buttons',
        'previous_states',
        'loaded',
      ]),
      ...mapGetters({
        current_question: 'currentQuestion',
        current_type: 'currentType',
        current_assistant: 'currentAssistant',
      }),

      checkForClose() {
          if (this.current_question_buttons.length == 1 && this.current_question_buttons[0].check_close == 1) {
              return false
          } else {
              return true
          }
      },
    }
  }
</script>

<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
    {
        opacity: 0
    }

    .btn-primary {
        background-color: #025aa5;
    }

    .btn-primary:hover {
        background-color: #006ac4;
    }

    #btn-custom {
        margin-right: 0px;
    }

    .bottom-pad {
        padding-bottom: 60px;
    }

    .upper-pad {
        padding-bottom: 20px;
    }

    #g-custom {
        padding-top: 10px;
    }

    .card-columns, .card-deck {
        padding-top: 20px;
    }

    #tg-btn {
        float: right;
        padding-top: 3px;
    }

</style>