import Vue from 'vue'

export default new Vue({
    methods: {
        nextPost () {
            this.$emit('nextPost')
        },
        previousPost () {
            this.$emit('previousPost')
        }
    }
})
