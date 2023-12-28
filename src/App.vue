<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

import Index from "@/components/Index";

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Index
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
