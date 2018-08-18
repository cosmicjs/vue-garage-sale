import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/post/:postIndex?',
            name: 'post',
            component: () => import('@/components/PostDetails.vue'),
            props: true
        }
    ],
    mode: 'history'
})
