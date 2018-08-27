<template>
    <v-card :to="{name: 'post', params: {postIndex: postIndex}}" :title="postData.title">
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
            const img = this.postData.images[this.postData.mainImage].split('.')
            const imgPath = this.$store.getters.postResponsiveImagesPath
            if (this.$vuetify.breakpoint.smAndDown) {
                return imgPath + img[0] + '-xm_1x.' + img[1]
            } else {
                return imgPath + img[0] + '-sm_1x.' + img[1]
            }
        }
    }
}
</script>
<style>

</style>
