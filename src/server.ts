import express from 'express'
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import pieceRoutes from './routes/pieceRoutes'
import adminRouter from './routes/adminRoutes';
import { corsConfig } from './config/cors'
import { connectDB } from './config/db';
import axios from 'axios';

dotenv.config()
connectDB()

const app = express()
app.use(cors(corsConfig))

app.use(morgan('dev'))
app.use(fileUpload())

app.use(express.json())

app.use('/api/pieces', pieceRoutes)
app.use('/api/admin', adminRouter)

export default app