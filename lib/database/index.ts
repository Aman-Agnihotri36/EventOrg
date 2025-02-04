import mongoose from "mongoose";

let initialized = false;
const Mongouri = process.env.MONGODB_URI

console.log('SOUJ', Mongouri)

if (!Mongouri) {
    throw new Error('MongoDB URI is not defined in the environment variables.');
}



export const MongoDbConnect = async () => {


    if (initialized) {
        console.log('MongoDB already connected')
        return
    }

    try {
        await mongoose.connect(Mongouri, {
            dbName: 'Evently',

        })

        console.log('Mongo db Connected')
        initialized = true
    } catch (error) {
        console.log('MongoDb connection errro', error)
    }
}