import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

/* eslint-disable prefer-const, @typescript-eslint/no-explicit-any */
const cached = (global as any).mongoose || { conn: null, promise: null }
/* eslint-disable prefer-const, @typescript-eslint/no-explicit-any */

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn

    if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'evently',
        bufferCommands: false
    })

    cached.conn = await cached.promise

    return cached.conn
}
