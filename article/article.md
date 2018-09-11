
# Create Progressive Web App with ease using Vuejs, Cosmic JS, and GraphQL
<img src="./images/grid_view_Nexus.png" width="30%" alt="Main screen Nexus 5 Phone">

## TL;DR:
* Vue
* Vuex
* Cosmic JS
* GraphQL
* PWA applications

## Intro
Progressive Web Apps (PWA) combine the look and feel of an app with the ease of programming of a website. These cutting edge apps make it easy for your users to access your content, and engaged users increase your revenue. Rapid Loading is one of it's features. PWA load faster than mobile websites, even with limited internet availability, ensuring your users always have the best experience. These are the main features:

* Access Anywhere
* Direct Deployment
* Promote with SEO
* Always Available (even offline)
* Easy Updates
* Safe and Secure

One of the best parts of PWA is they are quick to build and quick to get to the market without dealing with any phone native code or app store wars.

This application was mainly inspired by Offerup, Letgo, and Craigslist.
Like Craigslist, LetGo allows you to buy and sell items locally, which means you don’t have to deal with the hassles of shipping like you would on eBay or Amazon. With 30 million users, it is more popular than OfferUp. LetGo has been featured in many commercial lately, so you may be more familiar with it as well. The only issue is that both apps are mobile apps available on both iPhone and Android platform, however there no PWA version. So let's sit back and see if we can leverage PWA, Vue.js Cosmic JS and build one.

## Application Overview
The application consist of mainly three major functions:
* Display a list of items for sale in your area. In our case it will be a gallery view if images for all items for sale
* The ability to search for keywords and filter the gallery view to the items matching the search term
* The ability to click an item image and show the item description, seller, more images, contact seller...
* The ability to add new item. This feature I didn't build due to the scope of this project, but this can certainly add a valuable addition.

<img src="./images/detail_view_Nexus.png" width="30%" alt="Post item detail view Nexus 5 Phone">

## Starting your Vue PWA app
Let's rollup our sleeves and get building. We'll start by creating the project using vue-cli commands. However if you don't have vue-cli installed, please follow this. So open your terminal window and type the following:

```
vue create garage-sale
# then select Manually...

Vue CLI v3.0.0-rc.9
┌───────────────────────────┐
│  Update available: 3.0.0  │
└───────────────────────────┘
? Please pick a preset: 
  default (babel, eslint) 
❯ Manually select features 

# Then select the PWA feature and the other ones with the spacebar
? Please pick a preset: Manually select features
? Check the features needed for your project: 
 ◉ Babel
 ◯ TypeScript
❯◉ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
 
? Pick a linter / formatter config: 
  ESLint with error prevention only 
  ESLint + Airbnb config 
❯ ESLint + Standard config 
  ESLint + Prettier 

? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ Lint on save
 ◯ Lint and fix on commit

🎉  Successfully created project barage-sale.
👉  Get started with the following commands:

 $ cd barage-sale
 $ npm run serve

```

So far, this step looks like any regular Vue app creation except the PWA selection step. Thanks to vue-cli which is a doing a lot work behind the secenes and add the service worker option which a major feature of PWAs.
So let's continue and add our functions step by step.

We also need to add vuetify which will be our css framework. Before using vuetify, I used Bootstrap for most of my projects, however after trying Vuetify, I was hooked since. Vuetify in my opinon offers two majore advantages:
* Rapid development, comparing to bootstrap
* Easy integration with Vue js

So let's add it to out project

```
vue add vue-cli-plugin-plugin
? Use a pre-made template? (will replace App.vue and HelloWorld.vue) Yes
? Use custom theme? No
? Use a-la-carte components? Yes
? Use babel/polyfill? Yes
✔  Successfully invoked generator for plugin: vue-cli-plugin-vuetify
```

Also notice, that I picked the `use-a-carte` option when adding Vuetify because I want to customize one of it's components, and also I don't want to import all components from Vuetify. This will keep the files smaller comparing to importing all Vutify library.

## Add the app components, router, and store

Since the application will act as a SPA (single page app) we need to add the router. For the purpose of our application we only need two routes:
* Home: where we display the posts grid view and the search toolbar
* Post: this is the item detail view where we can see the item details info

So let's open the terminal window, and add the following files:

```
# adding the vue components
touch src/views/Home.vue
touch src/components/PostGrid.vue
touch src/components/PostItem.vue
touch src/components/PostDetails.vue
touch src/components/PostCarousel.vue

# add router, store,
touch src/router/index.js
touch src/store/index.js
```

And we add the routes to our application like this:

```
# /garage-sale/src/router/index.js
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/post/:postIndex?',
            name: 'post',
            component: () => import('@/components/PostDetails.vue'),
            props: true
        }
    ],
    mode: 'history'
})
```

Note that the router we didn't import the `PostDetails.vue` component at the begining. This is lazy loading, which means that our app would not load this component at the start to make it faster and only load this component once the user needs it.
And let's edit the main.js and the App.vue as the following:

```
# /grarage-sale/main.js
import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App),
    created () {
        this.$store.dispatch('loadInitialData', {term: ''})
    }
}).$mount('#app')
```

```
# /garage-sale/App.vue
<template>
    <v-app id="app">
        <router-view></router-view>
    </v-app>
</template>
```

Note that in order to use Vuetify we don't say `import Vuetify from 'vuetify'` we import from `/plugins/vuetify` because we only need to select which components we are using. Take a look at [src/plugins/vuetify.js](https://github.com/mtermoul/garage-sale/blob/master/src/plugins/vuetify.js) and see how it's done.

## Adding the UI code
So let's start by creating our UI as we see below.

```
# /garage-sale/src/views/Home.vue
<template>
    <v-app id="home">
        <v-navigation-drawer app>
        ...
        </v-navigation-drawer>
        
        <v-toolbar>
        ...
        </v-toolbar>
        
        <v-content>
            <v-container fluid xfill-height>
                <v-layout row wrap>
                    <v-flex xs12>
                        <post-grid :posts="posts"></post-grid>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>
```
So far in our home page we just added a top toolbar with a search text field, search button, and left navigation menu. in page content area we just added a component `post-grid` which will serve as a place holder for our data.

Before moving any further we need some data to test and build our UI components. So without further due, lets do that in the next chapter.

## Building the backend with Cosmic JS
Before discovering Cosmic JS, I use to use either plain JSON files and write a little Node.js application that have a bunch of Rest API endpoints. Another alternative is using some cloud noSQL database to host the JSON data documents and write a server Rest API to serve that data. However all that is gone, after learining that with Cosmic JS, you no longer have to write server side API. Just design your data, insert or import from JSON files, and the Cosmic JS will generate the Rest API automatically for you. As a metter affect Cosmic JS, offers two kind of API end points:
* Rest API which will be CRUD methods for adding, displaying, and updating your data.
* GraphQL API, which is also similar to Rest, but you can write your queries using special Syntax called GraphQL. If your no familliar with GraphQL, I encourage you to review the documents. It's has been gaining a lot momentum lately due to it's flexibilites and popularity. Plus it was developed by Facebook. 
For my application I will include both Rest, and GraphQL methods to let you experiment and decide which one works best for you. If you are not using Cosmic JS, then you have to write your own server GraphQL API using some database as a storage mechanism, and Node.js for the GraphQL endpoints.

OK, let's jump in to Cosmic JS and add our data elements. aftrer you sign up for free account, open the dashboard and add new bucket called `garage-sale`.

<img src="./images/cosmic_add_bucket.png" width="30%" alt="Cosmic JS - Add new bucket">

After that open the dashboard for this bucket and from the left side menu, add the following `Object Type`:

* Posts
* Users
* Locations
* PostConditions
* PostCategories

Object Type is the equivilant of a database table, if you're coming from an RDBMS database. After adding each Object Type, you can start definig the `metafield` for each object type. A metafield is the equivilant of schema, or table columns. So let's see this process below: 

<img src="./images/cosmic_add_metafields.png" width="30%" alt="Cosmic JS - Add object metafields">

So add the following fields to each object type:
```
# Locations
city: text
state: text
country: text
postalCode: text

# Users
email: text
firstName: text
lastName: text

# Posts
title: text
description: text
condition: PostCondition
price: text
isFree: boolean
categories: [PostCategory]
images: [media/file] (files will be uploaded to Cosmic JS files.
mainImage: number
isSold: boolean
dateAdded: date
user: User

# PostConditions
name: text
desc: text

# PostCategories
name: text
```

After adding the `Object Type` and `metafields`, it's time to add some data. For adding data just click on the object type from Cosmic JS dashboard left menu, and start adding data. You can also insert data using Cosmic JS CLI API. Please review the documentation for the CLI functions. I personally used both the dashboard and the CLI to insert the test data for my applcation. Here is an example of how you would add data to the post categories object type:

```
# inserting into PostCategories
cosmic add-object --type_slug "postcategories" --title "Shoes" --metafields [{title: "name", value: "Shoes"}]
cosmic add-object --type_slug "postcategories" --title "Cars" --metafields [{title: "name", value: "Cars"}]
...
```
and in a similar way you can add all of your objects. For the images, it's easier to open the dashboard, and upload all of your images using the `Media` function from the left menu of Cosmic JS dashboard. For my application, each post have multiple images, and each emage has three versions. Extra small, small, and medium which will be selected based on the screnn display size. Since we are developing for PWA which is mainly for mobile devices, we will be mainly serving xm and sm images. However we asre also providing an alternate view for a desktop using the md files just in case if the app is opened from the desktop screen. We will get into more details about how to optimize images for our PWA app further down.

<img src="./images/cosmic_add_images.png" width="30%" alt="Cosmic JS - Add images">

And we are done from the back-end side. In the next section, we will review how to consume our data using Cosmic JS API.

## Consuming the Cosmic JS API via Rest or GraphQL
As mentioend earlier, Cosmic JS offers two ways to perform a CRUD operations via API calls. Firt we can interact with data using plain old API. For the full documentation please review [Cosmic JS Rest API Docs](https://cosmicjs.github.io/rest-api-docs/#introduction)
here are few examples:
```
Cosmic.getObjects({type: 'postcategories', limit: 10})
Cosmic.getObjects({type: 'users', skip: 5, limit: 2})
Cosmic.getObjects({type: 'posts'})
```

We can also interact with Cosmic JS via the GraphQL api. Please read the [Cosmic JS GraphQL API](https://cosmicjs.com/docs/graphql) for the full documentations. If you like to run few queries and test this API open this URL [](https://graphql.cosmicjs.com/) and write some GraphQL queries:

<img src="./images/cosmic_graphql_view.png" width="30%" alt="Cosmic JS - GraphQL interface">


## App state using Vuex, Cosmic JS, and Vue store.
