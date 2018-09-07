<template>
    <v-container fluid grid-list-md :class="{'py-0 px-1': $vuetify.breakpoint.smAndDown}">
        <v-layout row wrap>
            <v-flex v-if="!isDataReady" xs12>
                <img class="data-loading" src="img/misc/spinner.gif">
            </v-flex>
            <v-flex v-if="isDataReady" xs4
                v-for="(post, index) in posts"
                :key="`post-item-${index}`">
                <post-item :postData="post" :postIndex="index">
                </post-item>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import PostItem from '@/components/PostItem'

export default {
    props: ['posts'],
    components: {
        PostItem
    },
    computed: {
        isDataReady () {
            return this.$store.getters.isDataReady
        }
    }
}
</script>
<style>
.data-loading {
    margin-top: 50px;
}
</style>
