const cors = require('cors');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express')
const posts = require('../public/data/posts.json')
const users = require('../public/data/users.json')
const locations = require('../public/data/locations.json')

const PORT = 4000;

const typeDefs = gql`
    type Query {
        posts: [Post]
        users: [User]
        locations: [Location]
        searchPosts(term: String!): [Post]
    }

    type Post {
        id: ID!
        title: String!
        description: String
        condition: String
        price: Float
        isFree: Boolean @defaultValue(value: "false")
        categories: [String]
        location: Location
        images: [String]
        mainImage: Int
        isSold: Boolean @defaultValue(value: "false")
        dateAdded: String
        user: User!
    }

    type Location {
        id: ID!
        city: String!
        state: String!
        postalCode: String
    }

    type User {
        id: ID!
        email: String!
        firstName: String
        lastName: String
    }
`

const resolvers = {
    Query: {
        posts: () => posts,
        users: () => users,
        locations: () => locations,
        searchPosts: (root ,{term}) => {
            console.log('---- searchPosts: ', term)
            if (!term || !term.trim()) return posts
            return posts.filter(post => {
                // search for all the keywords inside title or description using AND operator
                const rgx = new RegExp('(?=.*' + term.trim().split(' ').join(')(?=.*') + ')', 'ig')
                return rgx.test(post.title) || rgx.test(post.description)
            })
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

app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`),
)
