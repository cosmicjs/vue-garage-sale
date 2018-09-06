const cors = require('cors');
const express = require('express');
const fs = require('fs');
const { ApolloServer, gql } = require('apollo-server-express')
// const postsData = require('../public/data/posts.json')
// const users = require('../public/data/users.json')
// const locations = require('../public/data/locations.json')
require('./config/db')
const { User, Location, Post, PostCategory, PostCondition }  = require('./models')

const PORT = 4000;
const cert = fs.readFileSync('./cert.pem');
const key = fs.readFileSync('./key.pem');
const options = {
    key: key,
    cert: cert,
};
const https = require('https');

const typeDefs = gql`
    #-------------- Queries ---------------
    type Query {
        posts: [Post]
        users: [User]
        locations: [Location]
        postCategories: [PostCategory]
        postConditions: [PostCondition]
        searchPosts(term: String!): [Post]
    }

    #-------------- Mutations ---------------
    type Mutation {
        createLocation(input: CreateLocationInput!): CreateLocationPayload
        createPost(input: CreatePostInput!): CreatePostPayload
        loadPosts: LoadPostsPayload
        loadData: LoadPostsPayload
    }

    type LoadPostsPayload {
        message: String!
    }

    #-------------- Post --------------------
    type Post {
        _id: String!
        title: String!
        description: String
        condition: String
        price: Float
        isFree: Boolean @defaultValue(value: "false")
        categories: [PostCategory]
        location: Location
        images: [String]
        mainImage: Int
        isSold: Boolean @defaultValue(value: "false")
        dateAdded: String
        user: User!
    }

    input CreatePostInput {
        title: String!
        description: String
        condition: String
        price: Float
        isFree: Boolean @defaultValue(value: "false")
        categories: [PostCategoryInput]
        location: LocationInput
        images: [String]
        mainImage: Int
        isSold: Boolean @defaultValue(value: "false")
        dateAdded: String
        user: UserInput!
    }

    input PostCategoryInput {
        name: String!
    }

    input LocationInput {
        city: String!
        state: String!
        country: String!
        postalCode: String
    }

    input UserInput {
        email: String!
        firstName: String
        lastName: String
    }

    type CreatePostPayload {
        post: Post
    }

    fragment postFields on Post {
        title
        description
        condition
        price
        isFree
        categories
        location
        images
        mainImage
        isSold
        dateAdded
        user
    }

    #-------------- Location --------------------
    type Location {
        _id: String!
        city: String!
        state: String!
        country: String!
        postalCode: String
    }

    input CreateLocationInput {
        city: String!
        state: String!
        country: String!
        postalCode: String
    }

    type CreateLocationPayload {
        location: Location
    }

    fragment locationFields on Location {
        city
        state
        country
        postalCode
    }

    #-------------- User --------------------
    type User {
        _id: String!
        email: String!
        firstName: String
        lastName: String
    }

    #-------------- PostCategory --------------------
    type PostCategory {
        _id: String!
        name: String!
    }

    #-------------- PostCondition --------------------
    type PostCondition {
        _id: String!
        name: String!
        desc: String
    }
`

// TODO: Add queries and mutations for the all data collections

const resolvers = {
    Query: {
        posts: async () => {
            return await Post.find({})
        },
        users: async () => {
            return await User.find({})
        },
        locations: async () => {
            return await Location.find({})
        },
        postCategories: async () => {
            return await PostCategory.find({})
        },
        postConditions: async () => {
            return await PostCondition.find({})
        },
        // searchPosts: (root ,{term}) => {
        //     if (!term || !term.trim()) {
        //         return posts
        //     }
        //     return posts.filter(post => {
        //         // search for all the keywords inside title or description using AND operator
        //         const rgx = new RegExp('(?=.*' + term.trim().split(' ').join(')(?=.*') + ')', 'ig')
        //         return rgx.test(post.title) || rgx.test(post.description)
        //     })
        // }
        searchPosts: async (root ,{term}) => {
            if (!term || !term.trim()) {
                return await Post.find({})
            }
            // search for all the keywords inside title or description using AND operator
            const rgx = new RegExp('(?=.*' + term.trim().split(' ').join(')(?=.*') + ')', 'ig')
            return await Post.find({$or: [{title: rgx}, {title: rgx}]})
        }
    },
    Mutation: {
        createPost: async (root, {input}) => {
            const res = await Post.insert(input)
            return {post: res}
        },
        createLocation: async (root, {input}) => {
            const res = await Location.create(input)
            return {location: res}
        },
        loadPosts: async (root, args) => {
            // const res = await Post.insert(postObject)
            for (let i = 0; i < postsData.length; i++) {
                let postItem = postsData[i]
                let res = await Post.create(postItem)
            }
            return {message:  postsData.length + ' Posts loaded successfully.'}
        },
        loadData: async (root, args) => {
            // DO NOT RUN THIS METHOD
            // This function is only called once to load the data from json files into Cosmic JS database.
            const Cosmic =  require('../api/cosmic')
            let res
            // ------ load postCategories
            // const postCategories = require('../public/data/postCategories.json')
            // for (item in postCategories) {
            //     let payload = {
            //         type_slug: "postcategories",
            //         title: item,
            //         metafields: [
            //             {title: "name", value: item}
            //         ]
            //     }
            //     res = await Cosmic.addObject(payload)
            // }
            // res = await Cosmic.getObjects({type: 'postcategories'})
            // console.log('--- cosmic postCategories: ', res.objects.length)

            // ----- loadPostConditions
            // const postConditions = require('../public/data/postConditions.json')
            // for (item in postConditions) {
            //     let payload = {
            //         type_slug: "postconditions",
            //         title: item,
            //         metafields: [
            //             {title: "name", value: item},
            //             {title: "desc", value: postConditions[item]}
            //         ]
            //     }
            //     res = await Cosmic.addObject(payload)
            // }
            // res = await Cosmic.getObjects({type: 'postconditions'})
            // console.log('--- cosmic postConditions: ', res.objects.length)

            // ----- loadPosts
            const posts = require('../public/data/posts.json')
            const media = await Cosmic.getMedia({folder: 'post'})
            const postCategories = await Cosmic.getObjects({type: 'postcategories'})
            const postLocations = await Cosmic.getObjects({type: 'locations'})
            const postUsers = await Cosmic.getObjects({type: 'users'})

            let counter = 0
            for (post of posts) {
                // if (counter > 0) break
                console.log('>>>>>> post : ', post.title)
                let cats = postCategories.objects.filter(item => {
                    return item.title === post.categories[0].name
                })
                let loc = postLocations.objects.find(item => {
                    return item.title === 'Orlando'
                })
                let usr = postUsers.objects.find(item => {
                    return item.title === 'johnmiller@gmail.com'
                })
                let payload = {
                    type_slug: "posts",
                    title: post.title,
                    metafields: [
                        {title: "title", value: post.title},
                        {title: "description", value: post.description},
                        {title: "condition", value: post.condition},
                        {title: "price", value: post.price},
                        {title: "isFree", value: post.isFree},
                        {title: "categories", value: cats.map(item => item._id).join(','), type: 'objects', object: true, is_objects: true},
                        {title: "location", value: loc._id, type: 'object', object: true, is_object: true},
                        {title: "mainImage", value: post.mainImage},
                        {title: "isSold", value: post.isSold},
                        {title: "dateAdded", value: post.dateAdded},
                        {title: "user", value: usr._id, type: 'object', object: true, is_object: true}
                    ]
                }

                // add the images array to the post metafield
                let plImages = []
                for (image of post.images) {
                    // console.log('--- processing image: ', image)
                    let mediaMatches = media.media.filter(elem => {
                        return elem.original_name.includes(image.split('.')[0])
                    })
                    if (mediaMatches.length) {
                        for (elem of mediaMatches) {
                            plImages.push({type: 'repeating_item', children: [{type: 'file', file: true, image: true, key: image, title: elem.original_name, value: elem.name}]})
                        }
                    }
                }
                payload.metafields.push({title: 'images', type: 'repeater', object: true, children: plImages})
                res = await Cosmic.addObject(payload)
                counter++
            }

            res = await Cosmic.getObjects({type: 'posts'})
            console.log('--- cosmic posts: ', res.objects.length)
            return {message: '---- data loaded into cosmic successfully.'}
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
        settings: {
            'editor.theme': 'light'
        }
    }
})

const app = express()
app.use(cors())
server.applyMiddleware({ app })

let svr = https.createServer(options, app);
svr.listen({port: PORT}, () =>
    console.log(`🚀 Server ready at https://localhost:${PORT}${server.graphqlPath}`)
);

// activate the script below to redirect trafic http ---> https
// const http = require('http');
// http.createServer(app).listen(8080);
// app.use(function(req, res, next) {
//     if (req.secure) {
//         next();
//     } else {
//         console.log('HTTP ---> HTTPS REDIRECT: ' + req.url)
//         res.redirect('https://localhost:5000/' + req.url);
//     }
// });
