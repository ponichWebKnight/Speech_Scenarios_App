<template>
    <b-container>
        <b-breadcrumb :items="breadcrumbs"/>
        <b-row>
            <ul class="nav flex-column">
               <!-- <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'sa.settings.zone.index'}">Настройка зон</router-link>
                </li> -->
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'sa.settings.type.index'}">Настройка помощников
                    </router-link>
                </li>
            </ul>
        </b-row>
    </b-container>
</template>

<script>
  export default {
    name: 'index',
    metaInfo: {
      title: 'Настройки'
    },
    data () {
      return {
        ready: false,
        breadcrumbs: [{
            text: 'Назад',
            href: '#/'
        },{
          text: 'Настройки',
          active: true
        }]
      }
    }
  }
</script>

