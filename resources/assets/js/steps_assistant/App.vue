<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
  export default {
    name: 'App',
    metaInfo: {
      title: 'Rock',
      titleTemplate: 'Citylink :: %s'
    }
  }
</script>

<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-to {
        opacity: 0
    }
</style>