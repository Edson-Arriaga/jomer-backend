import colors from "colors";
import mongoose from "mongoose";
import { exit } from 'node:process'

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@jomer.lolial2.mongodb.net/`);
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB connected on: ${url}`))
    } catch (error) {
        console.log(colors.red.bold(error.message))
        exit(1)
    }
}
