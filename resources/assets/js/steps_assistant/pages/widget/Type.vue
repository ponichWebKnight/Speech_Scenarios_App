<template>
    <b-container v-if="loaded">
        <b-breadcrumb :items="breadcrumbs"/>
        <b-row>
            <b-col xs="12">
                <b-form-input v-model="searchType" type="text" placeholder="Поиск..."></b-form-input>
            </b-col>
        </b-row>
        <div>
            <b-table striped hover :items="types" :fields="fields" :filter="searchType" @row-clicked="goToActiveAssistant"></b-table>
        </div>
    </b-container>
    <b-container v-else>
        <spinner message="Загрузка..." :size="55" :line-size="7"></spinner>
    </b-container>
</template>


<script>
  import router from '../../router'
  import { createNamespacedHelpers } from 'vuex'
  import { DELETE_ASSISTANT_OPTIONS, DATA_LOADED, DATA_LOADING, RESET_ASSISTANTS_LIST } from '../../store/widget/mutation-types'
  import Spinner from 'vue-simple-spinner'

  const {mapActions, mapState, mapMutations} = createNamespacedHelpers('widget')

  export default {
    name: 'type',
    components: {
      Spinner
    },
    metaInfo: {
      title: 'Список видов помощников'
    },
    data() {
      return {
        breadcrumbs: [/*{
          text: 'Назад',
          href: '#/'
        },*/
        {
          text: 'Главная',
          active: true
        }],
        fields: {
          name: {
            label: 'Имя',
            sortable: true
          }
        },
        searchType: null,
      }
    },
    created () {
      this.dataLoading()
    },
    mounted () {
      this.fetchTypes()
        .then(() => {
          this.dataLoaded()
        })
      this.deleteAssistantOptions()
    },
    methods: {
      ...mapActions([
        'fetchTypes',
        'fetchAssistants'
      ]),
      ...mapMutations({
        deleteAssistantOptions: DELETE_ASSISTANT_OPTIONS,
        dataLoaded: DATA_LOADED,
        dataLoading: DATA_LOADING,
        resetAssistantsList: RESET_ASSISTANTS_LIST,
      }),
    goToActiveAssistant (type) {
        this.resetAssistantsList
        this.fetchAssistants(type)
        setTimeout(() => {
            if (this.assistants.length == 1) {
                router.push({name: 'sa.widget.type.assistant.show', params: {type_id: type.id, assistant_id: this.assistants[0].id}})
            } else {
                router.push({name: 'sa.widget.type.actives', params: {type_id: type.id}})
            }
        }, 250)
      }
    },
    computed: mapState([
      'types',
      'assistants',
      'loaded',
    ]),
    filteredTypes: function() {
        return this.types.filter(type => {
            return type.name.match(this.searchType)
        })
    }
  }
</script>

<style>
    td {
        cursor: pointer;
    }
</style>
