<template>
    <b-col sm="12" md="12" lg="6" xl="6">
        <b-card class="question-card" :title="title">
            <template v-for="button in buttons">
                <b-button size="" variant="primary" @click="buttonPressed(button)">{{ button.name }}</b-button>
            </template>
        </b-card>
    </b-col>
</template>

<script>
  export default {
    props: ['title', 'buttons'],
    methods: {
      buttonPressed (button) {
        this.$emit('buttonPressed', button)
      }
    }
  }
</script>

<style>
    .card {
        padding: 30px;
    }

    .btn {
        margin-right: 10px;
        margin-bottom: 10px;
    }
</style>

