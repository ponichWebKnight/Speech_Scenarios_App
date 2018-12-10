<template>
    <b-container v-if="loaded">
        <b-breadcrumb :items="breadcrumbs"/>
        <div class="clearfix">
            <b-button size="sm" variant="success" class="float-right" v-b-modal.create_modal>
                <i class="fa fa-plus" aria-hidden="true"></i> Добавить вид помощника
            </b-button>
        </div>
        <b-row v-if="types && types.length > 0">
            <b-table @row-clicked="rowClicked" hover :items="types" :fields="fields">
                <template slot="buttons" slot-scope="data">
                    <router-link :to="{ name: 'sa.settings.type.assistant.index', params: {type_id: data.item.id}}">
                        <template>
                            <b-button variant="primary">
                                <i class="fa" aria-hidden="true"></i> Изменить
                            </b-button>
                        </template>
                    </router-link>
                    <b-button v-b-modal.delete_modal @click.stop="itemToDelete=data.item" variant="danger">
                        <i class="fa fa-trash-o" aria-hidden="true"></i> Удалить
                    </b-button>
                </template>
                <template slot="active" slot-scope="data">
                    <span v-if="data.item.activeExist">Активен</span>
                    <span v-else>Неактивен</span>
                </template>
            </b-table>
        </b-row>
        <b-row v-else>
            <b-col xs="12">
                <b-alert show variant="warning">Виды отсутствуют</b-alert>
            </b-col>
        </b-row>
        <b-modal id="edit_modal"
                 ref="edit_modal"
                 title="Изменить вид помощника"
                 @hidden="editedType = {}"
                 @ok="editType">
            <form @submit.stop.prevent="handleSubmit">
                <label>Наименование:</label>
                <b-form-input type="text"
                              v-model="editedType.name"></b-form-input>
            </form>
        </b-modal>
        <b-modal id="create_modal"
                 ref="create_modal"
                 title="Добавить вид помощника"
                 @hidden="createdType = { name: '' }"
                 @ok="createType">
            <form @submit.stop.prevent="handleSubmit">
                <label>Наименование:</label>
                <b-form-input type="text"
                              v-model="createdType.name"></b-form-input>
            </form>
        </b-modal>
        <b-modal id="delete_modal"
                 ref="delete_modal"
                 title="Удаление вида помощника"
                 header-bg-variant="warning"
                 @hidden="itemToDelete = {}"
                 @ok="removeType(itemToDelete)">
            <form @submit.stop.prevent="handleSubmit">
                <label>Вы уверены, что действительно хотите удалить этот вид помощника?</label>
            </form>
        </b-modal>
    </b-container>
    <b-container v-else>
        <true-spinner :size="100" :speed="1"></true-spinner>
    </b-container>

</template>

<script>
  import { createNamespacedHelpers } from 'vuex'
  import { DATA_LOADED, DATA_LOADING } from '../../store/settings/mutation-types'
  import { cloneDeep } from 'lodash'
  import TrueSpinner from '../../components/TrueSpinner'

  const {mapActions, mapState, mapMutations} = createNamespacedHelpers('settings')

  export default {
    name: 'type',
    metaInfo: {
      title: 'Виды помощников'
    },
    components: {
      TrueSpinner
    },
    data () {
      return {
        ready: false,
        breadcrumbs: [{
          text: 'Назад',
          href: '#/'
        }, {
          text: 'Настройки',
          href: '#/settings'
        }, {
          text: 'Виды помощников',
          active: true
        }],
        fields: {
          name: {
            label: 'Наименование',
            sortable: true
          },
          buttons: {
            label: 'Опции',
            sortable: false
          },
          active: {
            label: 'Текущий статус',
            sortable: true
          }
        },
        createdType: {
          name: ''
        },
        editedType: {},
        checkActiveType: null,
      }
    },
    created () {
      this.dataLoading()
    },
    mounted () {
      this.fetchTypes()
        .then(() => {this.dataLoaded()})
      console.log(this.types)
    },
    methods: {
      ...mapActions([
        'fetchTypes',
        'removeType',
        'storeType',
        'updateType',
      ]),
      ...mapMutations({
        dataLoaded: DATA_LOADED,
        dataLoading: DATA_LOADING,
      }),
      createType () {
        this.storeType(this.createdType)
          .then(() => {
            this.fetchTypes()
          })
      },
      rowClicked (item) {
        this.editedType = cloneDeep(item)
        this.$refs.edit_modal.show()
      },
      editType () {
        this.updateType(this.editedType)
      },
      checkStatus (arr) {
          this.checkActiveType = arr.some((el) => {
              return el.status == 'active'
          })
          return this.checkActiveType
      }
    },
    computed: {
      ...mapState([
         'types',
         'loaded'
      ])
    }
  }
</script>

<style>


</style>
