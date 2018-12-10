<template>
    <b-container v-if="loaded">
        <b-breadcrumb :items="breadcrumbs"/>
        <div class="clearfix">
            <b-button size="sm" variant="success" class="float-right" v-b-modal.create_modal>
                <i class="fa fa-plus" aria-hidden="true"></i> Добавить зону
            </b-button>
        </div>
        <b-row v-if="zones && zones.length > 0">
            <b-table @row-clicked="rowClicked" hover :items="zones" :fields="fields">
                <template slot="cities" slot-scope="data">
                    <b-badge variant="default" v-for="(city, index) in data.value" :key="index">{{ city }}</b-badge>
                </template>
                <template slot="buttons" slot-scope="data">
                    <b-button @click.stop.prevent="removeZone(data.item)" variant="danger">
                        <i class="fa fa-trash-o" aria-hidden="true"></i> Удалить
                    </b-button>
                </template>
            </b-table>
        </b-row>
        <b-row v-else>
            <b-col xs="12">
                <b-alert show variant="warning">Зоны отсутствуют</b-alert>
            </b-col>
        </b-row>
        <b-modal id="edit_modal"
                 ref="edit_modal"
                 title="Изменить зону"
                 @hidden="editedZone = {}"
                 @ok="editZone">
            <form @submit.stop.prevent="handleSubmit">
                <label>Наименование:</label>
                <b-form-input type="text"
                              v-model="editedZone.name"></b-form-input>
                <label>Города:</label>
                <div role="group" class="custom-controls-stacked">
                    <b-form-checkbox v-for="city in cities"
                                     :key="city.id"
                                     :name="city.short_en"
                                     v-model="editedZone.cities"
                                     :value="city.name_ru">
                        {{ city.name_ru }}
                    </b-form-checkbox>
                </div>
            </form>
        </b-modal>
        <b-modal id="create_modal"
                 ref="create_modal"
                 title="Добавить зону"
                 @hidden="createdZone = { name: '', cities: [] }"
                 @ok="createZone">
            <form @submit.stop.prevent="handleSubmit">
                <label>Наименование:</label>
                <b-form-input type="text"
                              v-model="createdZone.name"></b-form-input>
                <label>Города:</label>
                <div role="group" class="custom-controls-stacked">
                    <b-form-checkbox v-for="city in cities"
                                     :key="city.id"
                                     :name="city.short_en"
                                     v-model="createdZone.cities"
                                     :value="city.name_ru">
                        {{ city.name_ru }}
                    </b-form-checkbox>
                </div>
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
    name: 'zone',
    metaInfo: {
      title: 'Зоны'
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
          text: 'Зоны',
          active: true
        }],
        fields: {
          id: {
            label: '#',
            sortable: true
          },
          name: {
            label: 'Наименование',
            sortable: true
          },
          cities: {
            label: 'Города',
            sortable: false
          },
          buttons: {
            label: '',
            sortable: false
          }
        },
        editedZone: {},
        createdZone: {
          name: '',
          cities: []
        }
      }
    },
    created () {
      this.dataLoading()
    },
    mounted () {
      this.fetchZones()
        .then(() => {
          this.fetchCities()
        })
        .then(() => {
          this.dataLoaded()
        })
    },
    methods: {
      ...mapActions([
        'fetchZones',
        'fetchCities',
        'updateZone',
        'storeZone',
        'removeZone'
      ]),
      ...mapMutations({
        dataLoaded: DATA_LOADED,
        dataLoading: DATA_LOADING,
      }),
      rowClicked (item) {
        this.editedZone = cloneDeep(item)
        this.$refs.edit_modal.show()
      },
      editZone () {
        this.updateZone(this.editedZone)
      },
      createZone () {
        this.storeZone(this.createdZone)
          .then(() => {
            this.fetchZones()
          })
      }
    },
    computed: mapState([
      'zones',
      'cities',
      'loaded'
    ])
  }
</script>

<style>

</style>
