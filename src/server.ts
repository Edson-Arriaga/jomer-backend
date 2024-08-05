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
app.use(morgan('dev'))

app.use(cors(corsConfig))
app.use(fileUpload())

app.use(express.json())

app.get('/', async (req, res) => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      res.send(`Your IP is: ${response.data.ip}`);
    } catch (error) {
      res.status(500).send('Error getting IP address');
    }
  });

app.use('/api/pieces', pieceRoutes)
app.use('/api/admin', adminRouter)

export default app