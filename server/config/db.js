const mongoose = require('mongoose')

// using mongodb cloud database here, however this needs to be put inton the config file.
const dbURI = "mongodb://superman:welcome2db@cluster0-shard-00-00-zyjxd.mongodb.net:27017,cluster0-shard-00-01-zyjxd.mongodb.net:27017,cluster0-shard-00-02-zyjxd.mongodb.net:27017/garage-sale?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"

const options = {
    reconnectTries: Number.MAX_VALUE,
    poolSize: 10,
    useNewUrlParser: true
}

mongoose.connect(dbURI, options).then(
    () => {
        console.log('Database connection established!')
    },
    err => {
        console.log('Error connecting to instance due to: ', err)
    }
)

