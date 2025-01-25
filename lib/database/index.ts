import mongoose from "mongoose";

let initialized = false;
const Mongouri = process.env.MONGODB_URI

if (!Mongouri) {
    throw new Error('MongoDB URI is not defined in the environment variables.');
}



export const connect = async () => {
    mongoose.set('strictQuery', true)

    if (initialized) {
        console.log('MongoDB already connected')
        return
    }

    try {
        await mongoose.connect(Mongouri, {
            dbName: 'next auth app',

        })

        console.log('Mongo db Connected')
        initialized = true
    } catch (error) {
        console.log('MongoDb connection errro', error)
    }
}