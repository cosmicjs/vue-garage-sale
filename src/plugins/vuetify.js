import Vue from 'vue'
import {
    Vuetify,
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VTextField,
    VCard,
    VCarousel,
    VAvatar,
    VDialog,
    transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'
import {
    ClickOutside,
    Ripple,
    Resize,
    Scroll,
    Touch
} from 'vuetify/es5/directives'

Vue.use(Vuetify, {
    components: {
        VApp,
        VNavigationDrawer,
        VFooter,
        VList,
        VBtn,
        VIcon,
        VGrid,
        VToolbar,
        VTextField,
        VCard,
        VCarousel,
        VAvatar,
        VDialog,
        transitions
    },
    directives: {
        ClickOutside,
        Ripple,
        Resize,
        Scroll,
        Touch
    }
})
