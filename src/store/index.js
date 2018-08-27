import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
// import { GraphQLClient } from 'graphql-request'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

// const client = new GraphQLClient('http://localhost:4000/graphql', {
//     headers: {
//         // auth params here....
//     }
// })

const client = new ApolloClient({
    uri: 'https://localhost:4000/graphql'
})

Vue.use(Vuex)
Vue.use(VueResource)

export default new Vuex.Store({
    state: {
        localDataUrl: process.env.BASE_URL + 'data/',
        postImagesPath: process.env.BASE_URL + 'img/posts/',
        postResponsiveImagesPath: process.env.BASE_URL + 'img/responsive/posts/',
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
        SET_POST_CATEGORIES (state, value) {
            state.postCategories = value
        },
        SET_PORT_CONDITIONS (state, value) {
            state.postConditions = value
        },
        SET_SEARCH_TERM (state, value) {
            state.searchTerm = value
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
        updatePosts ({commit, state}, payload) {
            Vue.http.get(state.localDataUrl + 'posts.json')
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        commit('SET_POSTS', data)
                    }
                })
        },
        updatePostCategories ({commit, state}, payload) {
            Vue.http.get(state.localDataUrl + 'postCategories.json')
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        commit('SET_POST_CATEGORIES', data)
                    }
                })
        },
        updatePostConditions ({commit, state}, payload) {
            Vue.http.get(state.localDataUrl + 'postConditions.json')
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        commit('SET_PORT_CONDITIONS', data)
                    }
                })
        },
        updateSearchTerm ({commit}, payload) {
            commit('SET_SEARCH_TERM', payload)
        },
        loadInitialData ({commit, dispatch}, payload) {
            dispatch('updatePostConditions')
            dispatch('updatePostCategories')
            dispatch('fetchPosts', payload)
            commit('SET_USER_LOCATION', {city: 'Orlando', state: 'FL', postalCode: '32821'})
        },
        // fetchPostsSimple ({commit}, payload) {
        //     // fetch graphql data using graphql-request lib
        //     const variables = {term: (payload && payload.term) ? payload.term : ''}
        //     const query = `query SearchPosts($term: String!){
        //         searchPosts(term: $term){
        //             id
        //             title
        //             description
        //             condition
        //             price
        //             isFree
        //             categories
        //             location {
        //                 city
        //                 state
        //                 postalCode
        //             }
        //             images
        //             mainImage
        //             isSold
        //             dateAdded
        //             user {
        //                 email
        //                 firstName
        //                 lastName
        //             }
        //         }
        //     }`
        //     client.request(query, variables)
        //         .then(data => {
        //             commit('SET_POSTS', data.searchPosts)
        //         })
        //         .catch(error => {
        //             // eslint-disable-next-line
        //             console.log(error)
        //         })
        // },
        fetchPosts ({commit}, payload) {
            client
                .query({
                    query: gql`query SearchPosts($term: String!) {
                            searchPosts(term: $term) {
                                _id
                                title
                                description
                                condition
                                price
                                isFree
                                categories { name }
                                location {
                                    city
                                    state
                                    postalCode
                                }
                                images
                                mainImage
                                isSold
                                dateAdded
                                user {
                                    email
                                    firstName
                                    lastName
                                }
                            }

                        }`,
                    variables: {term: (payload && payload.term) ? payload.term : ''}
                })
                .then(data => {
                    commit('SET_POSTS', data.data.searchPosts)
                })
                .catch(error => {
                    // eslint-disable-next-line
                    console.log(error)
                })
        }
    }
})
