<template>
    <v-card :to="{name: 'post', params: {postIndex: postIndex}}">
        <v-card-media
            height="200px"
            :src="mainImageUrl">
        </v-card-media>
    </v-card>
</template>
<script>
export default {
    props: ['postData', 'postIndex'],
    computed: {
        mainImageUrl () {
            return this.$store.getters.postImagesPath + this.postData.images[this.postData.mainImage]
        }
    }
}
</script>
<style>

</style>
