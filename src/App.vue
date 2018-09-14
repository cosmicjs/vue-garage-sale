<template>
    <v-app id="app">
        <router-view></router-view>
    </v-app>
</template>
<script>
export default {
}
</script>

<style>
body, html{
    /*overflow: auto;*/
    /*overflow-x: hidden;*/
    /*height: 100%;*/
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    overflow-x: hidden;
}
#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
