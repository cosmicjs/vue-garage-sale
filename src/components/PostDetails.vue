<template>
    <v-app id="post-details">
    <v-container fill-height fluid
        :class="{'pa-0': $vuetify.breakpoint.smAndDown}">
        <v-layout row wrap
            class="no-overflow"
            v-touch="{
                left: () => swipe('left'),
                right: () => swipe('right')
            }">
            <v-flex xs12 sm6 offset-sm3>
                <transition appear mode="out-in" :enter-active-class="enterAnimation" :leave-active-class="leaveAnimation">
                <post-carousel
                    :cycle="false"
                    :hide-controls="$vuetify.breakpoint.smAndDown"
                    :class="{'view-medium-and-up': $vuetify.breakpoint.mdAndUp}"
                    vertical-scrolling
                    next-icon="keyboard_arrow_down"
                    prev-icon="keyboard_arrow_up"
                    lazy
                    v-show="isContainerVisible"
                    :value="carouselImageIndex"
                    class="post-item-carousel">
                    <div class="v-post-controls post-details white--text">
                        <v-btn round outline color="white"
                            @click="onPostDetailsClick">More Info
                        </v-btn>
                    </div>
                    <div class="v-post-controls btn-close white--text caption"
                        @click.capture="onCloseButtonClick">
                        <v-icon medium color="white">close</v-icon>
                    </div>
                    <div class="v-post-controls btn-share white--text caption"
                        @click="onShareButtonClick">
                        <div><v-icon medium color="white">share</v-icon></div>
                        <div>Share</div>
                    </div>
                    <div class="v-post-controls btn-save white--text caption"
                        @click="onSaveButtonClick">
                        <div><v-icon medium color="white">favorite_border</v-icon></div>
                        <div>Save</div>
                    </div>
                    <div class="v-post-controls post-desc white--text">
                        <v-layout row>
                        <v-flex>
                            <v-avatar
                                size="40"
                                color="amber darken-1"
                                @click="onPostUserAvatarClick">
                                <v-icon medium color="white">person</v-icon>
                            </v-avatar>
                        </v-flex>
                        <v-flex text-xs-left class="pl-2" @click="onPostInfoClick">
                            <div class="post-title title">
                                {{ postData.metadata.title }}
                            </div>
                            <div class="post-price headline">
                                {{ '$' + postData.metadata.price.toFixed(0) }}
                            </div>
                        </v-flex>
                        </v-layout>
                    </div>
                    <div class="v-post-controls btn-contact-seller white--text">
                        <v-btn round color="pink white--text"
                            class="title"
                            @click="onContactSellerClick">Contact seller</v-btn>
                    </div>
                    <div class="v-post__prev"
                        v-show="$vuetify.breakpoint.mdAndUp"
                        @click.capture="onPrevPostClick">
                        <v-btn icon dark>
                            <v-icon size="46">chevron_left</v-icon>
                        </v-btn>
                    </div>
                    <div class="v-post__next"
                        v-show="$vuetify.breakpoint.mdAndUp"
                        @click.capture="onNextPostClick">
                        <v-btn icon dark>
                            <v-icon size="46">chevron_right</v-icon>
                        </v-btn>
                    </div>
                    <v-carousel-item
                        v-for="(item, i) in postImages"
                        :key="i"
                        reverse-transition="slide-y-reverse-transition"
                        transition="slide-y-transition"
                        class="xanimated"
                        :src="postImageUrl(item)">
                    </v-carousel-item>
                </post-carousel>
                </transition>
                <transition appear mode="out-in" enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
                <div class="v-carousel v-post-controls post-details-section white--text"
                    v-show="isPostDetailsVisible"
                    v-touch="{
                        up: () => swipe('up'),
                        down: () => swipe('down')
                    }">
                    <div class="v-post-controls btn-close white--text caption"
                        @click="onCloseDetailsButtonClick">
                        <v-icon medium color="white">close</v-icon>
                    </div>
                    <div class="post-title title">
                        {{ postData.metadata.title }}
                    </div>
                    <div class="post-price headline">
                        {{ '$' + postData.metadata.price.toFixed(0) }}
                    </div>
                    <div class="post-desc body1">
                        {{ postData.metadata.description }}
                    </div>
                    <br>
                    <div class="post-location body2">
                        <span><v-icon color="white">location_on</v-icon></span>
                        <span>{{ postLocation }}</span>
                        <div class="post-map">
                            <img src="/img/misc/map_preview.png">
                        </div>
                    </div>
                </div>
                </transition>
            </v-flex>

            <v-dialog v-model="dialog" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">User profile</v-card-title>
                    <v-card-text>Please login using your email, in order to use this function. If you don't have an account, please sign-up for free using the link below</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click.native="dialog = false">Login</v-btn>
                        <v-btn color="green darken-1" flat @click.native="dialog = false">Sign-up (new user)</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-layout>
    </v-container>
    </v-app>
</template>
<script>
import PostCarousel from './PostCarousel'

export default {
    props: ['postIndex'],
    data () {
        return {
            isPostDetailsVisible: false,
            enterAnimation: 'animated fadeInRight',
            leaveAnimation: 'animated fadeOutLeft',
            isContainerVisible: true,
            dialog: false,
            carouselImageIndex: 0
        }
    },
    computed: {
        postData () {
            return this.$store.getters.posts[Number(this.postIndex)]
        },
        postsCount () {
            return this.$store.getters.posts.length
        },
        postLocation () {
            const loc = this.postData.metadata.location.metafields
            const city = loc.find((item) => item.key === 'city').value
            const state = loc.find((item) => item.key === 'state').value
            const postalCode = loc.find((item) => item.key === 'postalcode').value
            return city + ', ' + state + ' ' + postalCode
        },
        postImages () {
            const imgSize = this.$vuetify.breakpoint.smAndDown ? '-xm_1x' : '-sm_1x'
            return this.postData.metadata.images.filter((element) => {
                return element[Object.keys(element)[0]].imgix_url.includes(imgSize)
            }).map((item) => {
                return item[Object.keys(item)[0]]
            })
        }
    },
    components: {
        PostCarousel
    },
    methods: {
        // ==========================
        // events
        // ==========================
        onCloseButtonClick () {
            this.$router.push({name: 'home'})
        },
        onSaveButtonClick () {
            this.dialog = true
        },
        onShareButtonClick () {
            this.dialog = true
        },
        onPostUserAvatarClick () {
            console.log('------ clicked on user Avatar')
        },
        onPostInfoClick () {
            this.isPostDetailsVisible = true
        },
        onContactSellerClick () {
            this.dialog = true
        },
        onPostDetailsClick () {
            this.isPostDetailsVisible = true
        },
        onCloseDetailsButtonClick () {
            this.isPostDetailsVisible = false
        },
        onPrevPostClick () {
            this.prevPost()
        },
        onNextPostClick () {
            this.nextPost()
        },
        // ==========================
        // others
        // ==========================
        postImageUrl (image) {
            return image.imgix_url
        },
        swipe (value) {
            if (this.isPostDetailsVisible && value === 'up') {
                this.isPostDetailsVisible = false
                return
            }
            if (this.isPostDetailsVisible) return
            if (value === 'left') this.nextPost()
            if (value === 'right') this.prevPost()
        },
        nextPost () {
            this.gotoPost(1)
        },
        prevPost () {
            this.gotoPost(-1)
        },
        gotoPost (step) {
            let targetIndex = Number(this.postIndex) + step
            if (targetIndex >= this.postsCount) {
                targetIndex = 0
            } else if (targetIndex < 0) {
                targetIndex = this.postsCount - 1
            }
            this.enterAnimation = step > 0 ? 'animated fadeInRight' : 'animated fadeInLeft'
            this.leaveAnimation = step > 0 ? 'animated fadeOutLeft' : 'animated fadeOutRight'
            this.isContainerVisible = false
            this.carouselImageIndex = 1
            setTimeout(() => {
                this.$router.push({name: 'post', params: {postIndex: targetIndex}})
            }, 200)
            setTimeout(() => {
                this.isContainerVisible = true
                this.carouselImageIndex = 0
            }, 210)
        }
    }
}
</script>
<style>
.post-item-carousel {
    height: 100%;
}
.v-carousel .v-jumbotron img {
    height: 100%;
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
}
.v-carousel .v-carousel__controls {
    background: none;
    -webkit-box-pack: start;
    justify-content: start;
    padding-top: 100px;
}
.v-carousel .v-carousel__controls button{
    filter: drop-shadow(.1em .1em .1em navy);
    opacity: 1;
}
.v-post-controls {
    position: absolute;
    z-index: 1;
}
.v-post-controls.btn-close {
    left: 10px;
    top: 20px;
    cursor: pointer;
    filter: drop-shadow(.1em .1em .1em navy);
}
.v-post-controls.btn-share {
    right: 5px;
    top: 20px;
    cursor: pointer;
    filter: drop-shadow(.1em .1em .1em navy);
}
.v-post-controls.btn-save {
    right: 5px;
    top: 80px;
    cursor: pointer;
    filter: drop-shadow(.1em .1em .1em navy);
}
.v-post-controls.post-desc {
    left: 50px;
    top: 80%;
    cursor: pointer;
    filter: drop-shadow(.1em .1em .1em navy);
}
.view-medium-and-up .v-post-controls.post-desc {
    top: 70%;
}
.v-post-controls.post-desc .post-title {
}
.v-post-controls.post-desc .post-price {
    font-weight: bold;
}
.v-post-controls.btn-contact-seller {
    bottom: 20px;
    width: 100%;
}
.view-medium-and-up .v-post-controls.btn-contact-seller {
    bottom: 40px;
}
.v-post-controls.btn-contact-seller button{
    text-transform: capitalize;
}
.v-post-controls.post-details {
    top: 20px;
    width: 100%;
}
.view-medium-and-up .v-post-controls.post-details {
    top: 40px;
}
.v-post-controls.post-details button {
    filter: drop-shadow(.1em .1em .1em navy);
}
.v-carousel.post-details-section-container {
    width: 100%;
    height: 100%;
}
.v-post-controls.post-details-section {
    height: 100%;
    z-index: 2;
    padding-left: 20px;
    padding-top: 100px;
    text-align: left;
    background: #000000b3;
    position: relative;
    top: -100%;
}
.v-post-controls.post-details-section .post-location .post-map {
    max-width: 95%;
    max-height: 100px;
    height: 100px;
    width: 95%;
}
.v-post-controls.post-details-section .post-location .post-map img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin-top: 10px;
    cursor: pointer;
}
.v-post__prev, .v-post__next {
    position: absolute;
    top: 50%;
    z-index: 1;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.v-post__prev {
    left: 15px;
}
.v-post__next {
    right: 15px;
}
.no-overflow {
    overflow-y: hidden;
    overflow-x: hidden;
}
</style>
