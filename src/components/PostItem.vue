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
        postImages () {
            const imgSize = this.$vuetify.breakpoint.smAndDown ? '-xm_1x' : '-sm_1x'
            return this.postData.metadata.images.filter((element) => {
                return element[Object.keys(element)[0]].imgix_url.includes(imgSize)
            }).map((item) => {
                return item[Object.keys(item)[0]]
            })
        },
        mainImageUrl () {
            return this.postImages[this.postData.metadata.mainimage].imgix_url
        }
    }
}
</script>
<style>

</style>
