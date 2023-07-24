import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        console.log(`mongodburi: ${process.env.MONGODB_URI}`)
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'user'
        })
        console.log('Mongodb connected')
    } catch (error) {
        console.log("an error occured while connecting to db", error)
    }
}