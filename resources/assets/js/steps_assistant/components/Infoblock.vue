<template>
    <b-card class="infoblock-card" :title="show_name === 0 ? name : null">
        <vue-markdown>{{ text }}</vue-markdown>
    </b-card>
</template>

<script>
  import VueMarkdown from 'vue-markdown'

  export default {
    props: ['name', 'show_name', 'text'],
    components: {
      VueMarkdown
    }
  }
</script>

<style>
    .infoblock-card img {
        max-width: 100%;
        height: auto;
    }

    .infoblock-card table {
        display: block;
        width: 100%;
        overflow-x: auto;
    }
</style>

