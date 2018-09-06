const Cosmic = require('cosmicjs')

const config = {
    bucket: {
        slug: process.env.COSMIC_BUCKET || 'garage-sale',
        read_key: process.env.COSMIC_READ_KEY,
        write_key: process.env.COSMIC_WRITE_KEY
    }
}

module.exports = Cosmic().bucket(config.bucket)
