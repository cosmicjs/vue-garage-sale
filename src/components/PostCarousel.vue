<script>
import { VCarousel } from 'vuetify'

export default {
    name: 'post-carousel',
    extends: VCarousel,
    props: {
        verticalScrolling: {
            type: Boolean // by default the item scrolls horizontally
        }
    },
    methods: {
        getTouchAction () {
            if (this.verticalScrolling) {
                return {
                    up: this.next,
                    down: this.prev
                }
            } else {
                return {
                    left: this.next,
                    right: this.prev
                }
            }
        }
    },
    render (h) {
        return h('div', {
            staticClass: 'v-carousel',
            class: {
                'v-vertical-scrolling': this.verticalScrolling
            },
            directives: [{
                name: 'touch',
                value: this.getTouchAction()
            }]
        }, [
            this.hideControls ? null : this.genIcon('prev', this.$vuetify.rtl ? this.nextIcon : this.prevIcon, this.prev),
            this.hideControls ? null : this.genIcon('next', this.$vuetify.rtl ? this.prevIcon : this.nextIcon, this.next),
            this.hideDelimiters ? null : this.genDelimiters(),
            this.$slots.default
        ])
    }
}
</script>
<style>
.v-carousel.v-vertical-scrolling .v-carousel__controls {
    height: 100%;
    width: 50px;
    flex-direction: column;
}
.v-carousel.v-vertical-scrolling .v-carousel__prev, .v-carousel.v-vertical-scrolling .v-carousel__next {
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    left: 50%;
    top: auto;
    right: auto;
}
.v-carousel.v-vertical-scrolling .v-carousel__prev {
    top: 5px;
}
.v-carousel.v-vertical-scrolling .v-carousel__next {
    bottom: 5px;
}
.v-carousel .v-carousel__controls {
    opacity: 0.5;
}
</style>
