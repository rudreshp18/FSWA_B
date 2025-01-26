const mongoose = require("mongoose")

function DbConnect() {
    const dbkey = process.env.MONGO_DB_API

    mongoose.connect(dbkey, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

        .then(() => {
            console.log('Connected to MongoDB Database')
        })
        .catch(err => console.error('Could not connect to MongoDB Database', err));
}

module.exports = DbConnect