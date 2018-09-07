<template>
    <v-app id="home">

        <v-navigation-drawer
            :clipped="$vuetify.breakpoint.lgAndUp"
            v-model="drawer"
            fixed
            app>
            <v-list dense>
                <template v-for="item in drawerItems">

                    <v-list-tile :key="item.text" @click="onMenuItemClick">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                </template>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            color="light-blue darken-4"
            dark
            app
            fixed>
            <v-layout>
                <v-flex xs2>
                    <v-toolbar-title xstyle="width: 300px" class="xml-0 xpl-0 text-xs-left">
                        <v-toolbar-side-icon @click.stop="drawer = !drawer" aria-label="Toolbar Drawer" role="button"></v-toolbar-side-icon>
                        <span class="hidden-sm-and-down">Garage-Sale</span>
                    </v-toolbar-title>
                </v-flex>
                <v-flex xs10>
                    <v-text-field
                        flat
                        solo
                        light
                        hide-details
                        label="Find in Garage-Sale..."
                        v-model="searchTerm"
                        :append-icon="searchInputIcon"
                        :prepend-icon="searchBackIcon"
                        @click:append="onSearchTextChange"
                        @click:prepend="onClearSearchResultsClick"
                        @input="onSearchTextInput">
                    </v-text-field>
                </v-flex>
            </v-layout>
        </v-toolbar>

        <v-content>
            <v-container fluid xfill-height :class="{'pa-0': $vuetify.breakpoint.smAndDown}">
                <v-layout row wrap>
                    <v-flex xs12>
                        <post-grid :posts="posts"></post-grid>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>

    </v-app>
</template>

<script>
import PostGrid from '@/components/PostGrid'

export default {
    data () {
        return {
            dialog: false,
            drawer: false,
            drawerItems: [
                { icon: 'photo_camera', text: 'Post' },
                { icon: 'settings', text: 'Settings' }
            ],
            searchTerm: '',
            searchInputIcon: 'search',
            isFilterOn: false
        }
    },
    computed: {
        userLocation () {
            return this.$store.getters.userLocation
        },
        userLocationDesc () {
            return this.userLocation.city + ', ' + this.userLocation.state
        },
        posts () {
            return this.$store.getters.posts
        },
        searchBackIcon () {
            if (this.isFilterOn) {
                return 'backspace'
            } else {
                return ''
            }
        }
    },
    components: {
        PostGrid
    },
    methods: {
        // ======================================
        // events
        // ======================================
        onMenuItemClick () {
            console.log('Clicked me!')
        },
        onSearchTextChange () {
            if (this.searchInputIcon === 'search') {
                if (this.searchTerm.length) {
                    this.$store.dispatch('fetchPosts', {term: this.searchTerm})
                    this.searchInputIcon = 'clear'
                    this.isFilterOn = true
                    this.$store.dispatch('updateSearchTerm', this.searchTerm)
                }
            } else {
                this.clearSearchTextField()
            }
        },
        onSearchTextInput () {
            if (this.searchInputIcon === 'clear') {
                this.searchInputIcon = 'search'
            }
        },
        onClearSearchResultsClick () {
            this.$store.dispatch('fetchPosts', {term: ''})
            this.clearSearchTextField()
            this.isFilterOn = false
            this.$store.dispatch('updateSearchTerm', this.searchTerm)
        },
        // ======================================
        // other
        // ======================================
        clearSearchTextField () {
            this.searchTerm = ''
            this.searchInputIcon = 'search'
        }
    },
    created () {
        if (this.$store.getters.searchTerm.length) {
            this.searchTerm = this.$store.getters.searchTerm
            this.searchInputIcon = 'clear'
            this.isFilterOn = true
        }
    }
}
</script>
<style>

</style>
