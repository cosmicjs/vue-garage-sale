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
    overflow: hidden;
}
.v-content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    width: 100vw;
    height: 100vh;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
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
