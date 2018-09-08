var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')
require('dotenv').config()

app = express()

app.use((req, res, next) => {
    if (req.secure) {
        next()
    } else {
        res.redirect(301, 'https://' + req.headers.host + req.url)
    }
})
app.use(serveStatic(__dirname + "/dist"))

var port = process.env.PORT || 5003
app.listen(port)

console.log('server started '+ port)

