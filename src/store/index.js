import Vue from 'vue'
import Vuex from 'vuex'
import Cosmic from '../api/cosmic' // used for Rest API
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost' // used for GraphQL API
import gql from 'graphql-tag'

const client = new ApolloClient({
    link: new HttpLink({uri: 'https://graphql.cosmicjs.com/v1'}),
    cache: new InMemoryCache()
})

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isDataReady: false,
        posts: [],
        userLocation: null, // city where the user is located
        currentUser: null, // the current user credentials to be able to post
        isUserAuthenticated: false, // false for browse only
        postCategories: [], // will be used for filtering posts, and easy navigation
        postCondition: [],
        searchTerm: ''
    },
    getters: {
        isUserAuthenticated (state) {
            return state.isUserAuthenticated
        },
        currentUser (state) {
            return state.currentUser
        },
        userLocation (state) {
            return state.userLocation
        },
        posts (state) {
            return state.posts
        },
        postCategories (state) {
            return state.postCategories
        },
        postConditions (state) {
            return state.postConditions
        },
        localDataUrl (state) {
            return state.localDataUrl
        },
        postImagesPath (state) {
            return state.postImagesPath
        },
        searchTerm (state) {
            return state.searchTerm
        },
        postResponsiveImagesPath (state) {
            return state.postResponsiveImagesPath
        },
        isDataReady (state) {
            return state.isDataReady
        }
    },
    mutations: {
        SET_IS_USER_AUTHENTICATED (state, value) {
            state.isUserAuthenticated = value
        },
        SET_CURRENT_USER (state, value) {
            state.currentUser = value
        },
        SET_USER_LOCATION (state, value) {
            state.userLocation = value
        },
        SET_POSTS (state, value) {
            state.posts = value
        },
        ADD_POSTS (state, value) {
            state.posts.push(...value)
        },
        SET_POST_CATEGORIES (state, value) {
            state.postCategories = value
        },
        SET_POST_CONDITIONS (state, value) {
            state.postConditions = value
        },
        SET_SEARCH_TERM (state, value) {
            state.searchTerm = value
        },
        SET_IS_DATA_READY (state, value) {
            state.isDataReady = value
        }
    },
    actions: {
        updateIsUserAutenticated ({commit}, payload) {
            commit('SET_IS_USER_AUTHENTICATED', payload)
        },
        updateCurrentUser ({commit}, payload) {
            commit('SET_CURRENT_USER', payload)
        },
        updateUserLocation ({commit}, payload) {
            commit('SET_USER_LOCATION', payload)
        },
        fetchPostCategories ({commit, state}, payload) {
            const params = {
                type_slug: 'postcategories'
            }
            Cosmic.getObjectsByType(params)
                .then(data => {
                    commit('SET_POST_CATEGORIES', data.objects)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        fetchPostConditions ({commit, state}, payload) {
            const params = {
                type_slug: 'postconditions'
            }
            Cosmic.getObjectsByType(params)
                .then(data => {
                    commit('SET_POST_CONDITIONS', data.objects)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        updateSearchTerm ({commit}, payload) {
            commit('SET_SEARCH_TERM', payload)
        },
        loadInitialData ({commit, dispatch}, payload) {
            dispatch('fetchPosts', payload)
            dispatch('fetchPostConditions')
            dispatch('fetchPostCategories')
            commit('SET_USER_LOCATION', {city: 'Orlando', state: 'FL', postalCode: '32821'})
        },
        async fetchPosts ({commit, state}, payload) {
            // fetch data from Cosmic JS via Rest API
            const maxRecords = 36
            let recordLimit = 3
            let skipPos = 0
            let fetchMore = true

            if (state.posts.length) {
                commit('SET_POSTS', [])
            }
            if (state.isDataReady) commit('SET_IS_DATA_READY', false)
            // fetch cosmic data in small batches to prevent long wait time.
            while (skipPos < maxRecords && fetchMore) {
                try {
                    const params = {
                        type: 'posts',
                        limit: recordLimit,
                        skip: skipPos
                    }
                    if (payload.term) {
                        params.metafield_key = 'title'
                        params.metafield_value = payload.term
                    }
                    let res = await Cosmic.getObjects(params)
                    if (res.objects && res.objects.length) {
                        commit('ADD_POSTS', res.objects)
                        commit('SET_IS_DATA_READY', true)
                    } else {
                        fetchMore = false
                    }
                    skipPos += recordLimit
                } catch (error) {
                    console.log(error)
                    fetchMore = false
                }
            }
        },
        fetchPostsGQ ({commit, state}, payload) {
            if (state.isDataReady) {
                commit('SET_IS_DATA_READY', false)
            }
            client
                .query({
                    query: gql`query Posts($bucket: String, $type: String!) {
                            objectsByType(bucket_slug: $bucket, type_slug: $type) {
                                _id
                                title
                                slug
                                metadata
                            }
                        }`,
                    variables: {bucket: 'garage-sale', type: 'posts'}
                })
                .then(data => {
                    commit('SET_POSTS', data.data.objectsByType)
                    commit('SET_IS_DATA_READY', true)
                })
                .catch(error => {
                    // eslint-disable-next-line
                    console.log(error)
                })
        }
    }
})
