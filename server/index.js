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
