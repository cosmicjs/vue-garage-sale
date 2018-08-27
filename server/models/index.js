const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }
})

const LocationSchema = new Schema({
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String
    }
})

const PostCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

const PostConditionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    }
})

const categoriesSubSchema = new Schema({
    name: {type: String, required: true}
}, {_id: false})

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    condition: {
        type: String,
        default: "Used"
    },
    price: {
        type: Number,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: false
    },
    categories: [categoriesSubSchema],
    location: {
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true},
        postalCode: String
    },
    images: [String],
    mainImage: Number,
    isSold: {
        type: String,
        default: false
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    user: {
        email: {type: String, required: true},
        firstName: String,
        lastName: String
    }
})

exports.User = mongoose.model("User", UserSchema)
exports.Location = mongoose.model("Location", LocationSchema)
exports.PostCategory = mongoose.model("PostCategory", PostCategorySchema, 'postCategories')
exports.PostCondition = mongoose.model("PostCondition", PostConditionSchema, 'postConditions')
exports.Post = mongoose.model("Post", PostSchema)
