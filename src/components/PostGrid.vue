<template>
    <v-container fluid grid-list-md :class="{'py-0 px-1': $vuetify.breakpoint.smAndDown}">
        <v-layout row wrap>
            <v-flex xs4
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
    }
}
</script>
<style>

</style>
