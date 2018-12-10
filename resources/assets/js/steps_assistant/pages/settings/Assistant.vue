<template>
    <b-container v-if="loaded">
        <b-breadcrumb :items="breadcrumbs"/>
        <div v-if="current_type">
            <h4><strong>{{ current_type.name }}</strong></h4>
        </div>
        <div class="clearfix">
            <b-button size="sm" variant="success" class="float-right" v-b-modal.create_modal>
                <i class="fa fa-plus" aria-hidden="true"></i> Добавить помощника
            </b-button>
        </div>
        <b-row v-if="assistants && assistants.length > 0">
            <b-table @row-clicked="rowClicked" hover border :items="assistants" :fields="fields">
                <template slot="zone" slot-scope="data">
                    <span v-if="data.item.zone">{{ data.item.zone.name }}</span>
                    <span v-else>Несуществующая зона</span>
                </template>
                <template slot="buttons" slot-scope="data">
                    <b-button v-if="data.item.status != 'active'" :disabled="data.item.questions.length == 0" @click.stop.prevent="activateAssistantClick(data.item)"
                              variant="success">
                        Активировать
                    </b-button>
                    <b-button v-else @click.stop.prevent="duplicateAssistantClick(data.item)" variant="success">
                        Дублировать
                    </b-button>
                    <router-link v-if="data.item.status != 'active'" :to="{ name: 'sa.settings.type.assistant.question.index',
                    params: { type_id: current_type.id, assistant_id: data.item.id }}">
                        <template>
                            <b-button variant="primary">
                                <i class="fa" aria-hidden="true"></i> Редактировать
                            </b-button>
                        </template>
                    </router-link>
                    <b-button v-if="data.item.status != 'active'" v-b-modal.delete_modal @click.stop.prevent="itemToDelete = data.item"
                              variant="danger">
                        <i class="fa fa-trash-o" aria-hidden="true"></i> Удалить
                    </b-button>
                    <b-button v-if="data.item.status == 'active'" @click.stop.prevent="archiveAssistantClick(data.item)" variant="warning">
                        Отключить
                    </b-button>
                </template>
            </b-table>
        </b-row>
        <b-row v-else>
            <b-col xs="12">
                <b-alert show variant="warning">Помощники отсутствуют</b-alert>
            </b-col>
        </b-row>
        <b-modal id="create_modal"
                 ref="create_modal"
                 title="Добавить помощника"
                 @hidden="createdAssistant = null"
                 @ok="createAssistant">
            <form @submit.stop.prevent="handleSubmit">
                <label>Зона:</label>
                <b-form-select v-model="createdAssistant" :options="zonesOption" class="mb-3">
                </b-form-select>
            </form>
        </b-modal>
        <b-modal id="edit_modal"
                 ref="edit_modal"
                 title="Изменить помощника"
                 @hidden="editedAssistant = {zone:{id:null}}"
                 @ok="editAssistant">
            <form @submit.stop.prevent="handleSubmit">
                <label>Зона:</label>
                <b-form-select v-model="editedAssistant.zone.id" :options="zonesOption" class="mb-3">
                </b-form-select>
            </form>
        </b-modal>
        <b-modal id="delete_modal"
                 ref="delete_modal"
                 title="Удаление помощника"
                 header-bg-variant="warning"
                 @hidden="itemToDelete = {}"
                 @ok="deleteAssistant(itemToDelete)">
            <form @submit.stop.prevent="handleSubmit">
                <label>Вы уверены, что действительно хотите удалить этого помощника?</label>
            </form>
        </b-modal>
    </b-container>
    <b-container v-else>
        <true-spinner :size="100" :speed="1"></true-spinner>
    </b-container>

</template>

<script>

  import { createNamespacedHelpers } from 'vuex'
  import { DATA_LOADED, DATA_LOADING, SET_CURRENT_TYPE_ID } from '../../store/settings/mutation-types'
  import TrueSpinner from '../../components/TrueSpinner'

  const {mapActions, mapState, mapMutations, mapGetters} = createNamespacedHelpers('settings')

  export default {
    name: 'assistant',
    metaInfo: {
      title: 'Помощники'
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
          active: true
        }],
        fields: {
          zone: {
            label: 'Город',
            sortable: true
          },
          status: {
            label: 'Статус',
            sortable: true
          },
          buttons: {
            label: 'Опции',
            sortable: false
          },
          id: {
            label: 'ID',
            sortable: false
          },
          updated_at: {
            label: 'Последнее изменение',
            sortable: true
          }
        },
        createdAssistant: null,
        editedAssistant: {zone: {id: null}},
      }
    },
    created () {
      this.dataLoading()
    },
    mounted () {
      this.setCurrentTypeId(parseInt(this.$route.params.type_id))

      if (this.current_type) {
        this.fetchAssistants(this.current_type)
          .then(() => this.fetchZones())
          .then(() => this.dataLoaded())
      } else {
        this.fetchTypes()
          .then(() => this.fetchAssistants(this.current_type))
          .then(() => this.fetchZones())
          .then(() => this.dataLoaded())
      }
    },
    methods: {
      ...mapActions([
        'fetchZones',
        'fetchTypes',
        'fetchAssistants',
        'storeAssistant',
        'updateAssistant',
        'removeAssistant',
        'activateAssistant',
        'duplicateAssistant',
        'archiveAssistant',
      ]),
      ...mapMutations({
        dataLoaded: DATA_LOADED,
        dataLoading: DATA_LOADING,
        setCurrentTypeId: SET_CURRENT_TYPE_ID,
      }),
      createAssistant () {
        this.dataLoading()
        this.storeAssistant({type: this.current_type, zone_id: this.createdAssistant})
          .then(() => this.fetchAssistants(this.current_type))
          .then(() => this.dataLoaded())
      },
      editAssistant () {
        this.dataLoading()
        //console.log(this.editedAssistant)
        this.updateAssistant({type: this.current_type, assistant: this.editedAssistant})
          .then(() => this.fetchAssistants(this.current_type))
          .then(() => this.dataLoaded())
      },
      deleteAssistant (assistant) {
        this.dataLoading()
        this.removeAssistant({type: this.current_type, assistant})
          .then(() => this.fetchAssistants(this.current_type))
          .then(() => this.dataLoaded())
      },
      rowClicked (assistant) {
        this.editedAssistant = {...assistant}
        this.$refs.edit_modal.show()
      },
      activateAssistantClick (assistant) {
        this.dataLoading()
        console.log(assistant)
        this.activateAssistant({type: this.current_type, assistant})
          .then(() => this.fetchAssistants(this.current_type))
          .then(() => this.dataLoaded())
      },
      duplicateAssistantClick (assistant) {
        this.dataLoading()
        this.duplicateAssistant({type: this.current_type, assistant})
          .then(() => this.fetchAssistants(this.current_type))
          .then(() => this.dataLoaded())
      },
      archiveAssistantClick (assistant) {
        this.dataLoading()
        this.archiveAssistant({type: this.current_type, assistant})
          .then(() => this.fetchAssistants(this.current_type))
          .then(() => this.dataLoaded())
      }
    },
    computed: {
      ...mapState([
        'loaded',
        'assistants',
        'zones',
        'questions',
      ]),
      ...mapGetters({
        current_type: 'currentType',
      }),
      zonesOption () {
        return this.zones.map((type) => {
          return {value: type.id, text: type.name}
        })
      }
    },

  }
</script>

<style>

</style>
