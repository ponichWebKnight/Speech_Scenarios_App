<template>
    <b-container>
        <b-row>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'sa.widget.index'}">Виджет</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'sa.settings.index'}">Настройки
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'sa.log.index'}">Лог
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'sa.stats.index'}">Статистика
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
      title: 'Пошаговый Помощник'
    }
  }
</script>