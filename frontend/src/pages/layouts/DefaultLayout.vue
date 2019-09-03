<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSideBar }">
    <side-bar>
      <sidebar-link to="/">
        <p>Home</p>
      </sidebar-link>
      <sidebar-link to="/validators">
        <p>Validators</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <main-content></main-content>
    </div>
  </div>
</template>

<script>
  import MainContent from './Content.vue'

  export default {
    components: {
      MainContent
    }
  }
</script>

<style scoped>

</style>
