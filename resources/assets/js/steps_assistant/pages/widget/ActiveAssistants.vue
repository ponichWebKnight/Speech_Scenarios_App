<template>
    <b-container v-if="loaded">
        <b-breadcrumb :items="breadcrumbs"/>
        <div>
            <b-row v-if="assistants && assistants.length > 0">
                <b-table v-if="assistants" striped hover :items="assistants" :fields="fields" @row-clicked="goToAssistant">
                    <template slot="zone" slot-scope="data">
                        {{data.value.name}}
                    </template>
                </b-table>
            </b-row>
            <b-row v-else>
                <b-col xs="12">
                    <b-alert show variant="warning">Помощники отсутствуют</b-alert>
                </b-col>
            </b-row>
        </div>
    </b-container>
    <b-container v-else>
        <spinner message="Загрузка..." :size="55" :line-size="7"></spinner>
    </b-container>
</template>
<script>
    import router from '../../router'
    import { createNamespacedHelpers } from 'vuex'
    import { DELETE_ASSISTANT_OPTIONS, DATA_LOADED, DATA_LOADING, SET_CURRENT_TYPE_ID } from '../../store/widget/mutation-types'
    import Spinner from 'vue-simple-spinner'

    const {mapActions, mapState, mapMutations, mapGetters} = createNamespacedHelpers('widget')

    export default {
        name: "active-assistants",
        components: {
            Spinner
        },
        metaInfo: {
            title: 'Список активных помощников'
        },
        data() {
            return {
                breadcrumbs: [/*{
                    text: 'Назад',
                    href: '#/'
                },*/
                {
                    text: 'Главная',
                    href: '#/widget'
                },
                {
                    text: 'Активные помощники',
                    active: true
                }],
                fields: {
                    zone: {
                        key: 'zone',
                        label: 'Город',
                        sortable: true
                    },
                }
            }
        },
        created () {
            this.dataLoading()
        },
        mounted () {
            this.setCurrentTypeId(parseInt(this.$route.params.type_id))

            if (this.current_type) {
                this.fetchAssistants(this.current_type)
                    .then(() => this.dataLoaded())
            } else {
                this.fetchTypes()
                    .then(() => this.fetchAssistants(this.current_type))
                    .then(() => this.dataLoaded())
            }
            this.deleteAssistantOptions()

        },
        methods: {
            ...mapActions([
                'fetchTypes',
                'fetchAssistants',
            ]),
            ...mapMutations({
                deleteAssistantOptions: DELETE_ASSISTANT_OPTIONS,
                dataLoaded: DATA_LOADED,
                dataLoading: DATA_LOADING,
                setCurrentTypeId: SET_CURRENT_TYPE_ID,
            }),
            goToAssistant (assistant) {
                router.push({name: 'sa.widget.type.assistant.show', params: {type_id: this.current_type.id, assistant_id: assistant.id}})
            }
        },
        computed: {
            ...mapState([
                'assistants',
                'zones',
                'loaded',
            ]),
            ...mapGetters({
                current_type: 'currentType',
                current_assistant: 'currentAssitant',
            }),
        }
    }
</script>

<style scoped>
    td {
        cursor: pointer;
    }
</style>