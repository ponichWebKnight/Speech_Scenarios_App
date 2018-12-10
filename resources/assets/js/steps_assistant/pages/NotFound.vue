<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Not Found</div>

                    <div class="panel-body">
                        Page yo are looking for not found.
                    </div>

                    <router-link to="/">Home</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    mounted () {
      console.log('Component mounted.')
    }
  }
</script>

