import express, { Request, Response } from 'express'
import cors from 'cors';
import 'dotenv/config';
import ConnectDB from './db/connect';
import authRouter from './routes/auth';
import userRouter from './routes/user'
import errorHandlerMiddleWare from './middleware/errorHandlerMiddleware';
import notFound from './middleware/notFound';
import {v2 as cloudinary} from 'cloudinary';
import resturantRouter from './routes/restaurant';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/v1/auth',authRouter)
app.use('/ap1/v1/user',userRouter)
app.use("/api/v1/restuarant",resturantRouter)
app.use("/health",async(req:Request,res:Response)=>{
    res.send({message:"health OK!"})
});
app.use(errorHandlerMiddleWare)
app.use(notFound)

const port = 5000
app.listen(port,async()=>{
    try{
        await ConnectDB(process.env.MONOGODB_URI)
        console.log('server is listening on 5000')
    }catch(error){
        console.log(error)
    }
})