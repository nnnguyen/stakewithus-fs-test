<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card class="md-card-plain">
          <md-card-header data-background-color="green">
            <h4 class="title">Hello World!</h4>
          </md-card-header>
          <md-card-content>
            <hello-world></hello-world>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
  import HelloWorld from '@/components/HelloWorld'

  export default {
    components: {
      HelloWorld
    }
  }
</script>
