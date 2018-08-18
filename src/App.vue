<template>
    <v-app id="app">
        <!-- <transition appear xmode="out-in" name="router-transition" enter-active-class="animated fadeInDown" leave-active-class="animated fadeInDown"> -->
        <router-view></router-view>
        <!-- </transition> -->
    </v-app>
</template>
<script>
export default {
}
</script>

<style>
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
