import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Restaurant from "../model/restaurant";
import cloudinary from 'cloudinary';
import mongoose from "mongoose";



const createRestuarant = async(req:Request,res:Response)=>{
    try{
      const existingRestaurant = await Restaurant.findOne({user:req.userId})
      if(existingRestaurant){
        return res.status(409).json({message:"User restaurant already exists"});
      }
        const image = req.file as Express.Multer.File;
        const base64Image = Buffer.from(image.buffer).toString("base64")
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = uploadResponse.url;
        restaurant.user = new mongoose.Types.ObjectId(req.userId)
        restaurant.lastUpdate = new Date();
        await restaurant.save();
        res.status(201).send(restaurant);
      
    }catch(error){
     console.log(error)
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Something went wrong"})
    }
}

const GetRestuarant = async (req:Request,res:Response)=>{
  try{
  const  restuarant = await Restaurant.findOne({user:req.userId})
    if(!restuarant){
      return res.status(StatusCodes.NOT_FOUND).json({message:"restuarant not found"})
    }
     res.status(StatusCodes.OK).json(restuarant)
  }catch(error){
     console.log(error)
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Error fetching data"})
  }
}

export default {
    createRestuarant,GetRestuarant
}