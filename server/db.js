let mongoose = require('mongoose')
require('dotenv').config()

let connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true, useNewUrlParser: true,
            useCreateIndex: true, useFindAndModify: false
        })
        console.log("MongoDB is connected now")
    } catch (error) {
        console.log("cant connect to db")
        //Exit the process with failure
        process.exit(1)
    }
}

module.exports = connectDB