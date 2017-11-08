<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: ''
    }
  }
}
</script>


<style>
*{
  margin:0px;
}
html,body,#app{
  height: 100%;
}

</style>