import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Restaurant from "../model/restaurant";
import cloudinary from 'cloudinary';
import mongoose from "mongoose";
import Order from "../model/order";



const createRestuarant = async(req:Request,res:Response)=>{
    try{
      const existingRestaurant = await Restaurant.findOne({user:req.userId})
      if(existingRestaurant){
        return res.status(409).json({message:"User restaurant already exists"});
      }
        // const image = req.file as Express.Multer.File;
        // const base64Image = Buffer.from(image.buffer).toString("base64")
        // const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
        
        const imageUrl = await  uploadImage(req.file as Express.Multer.File)
        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = imageUrl;
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

const UpdateRestuarant = async (req:Request,res:Response)=>{
   try{
     const restaurant = await Restaurant.findOne({
         user:req.userId
     })
     if(!restaurant){
      return res.status(StatusCodes.NOT_FOUND).json({message:"restuarant not found"})
     }
     restaurant.restaurantName = req.body.restaurantName;
     restaurant.city = req.body.city;
     restaurant.country = req.body.country;
     restaurant.deliveryPrice = req.body.deliveryPrice;
     restaurant.estimateDeliveryTime = req.body.estimateDeliveryTime
     restaurant.cuisines = req.body.cuisines;
     restaurant.menuItem = req.body.menuItem;
     restaurant.lastUpdate = new Date()
    if(req.file){
      const imageUrl = await  uploadImage(req.file as Express.Multer.File)
      restaurant.imageUrl =  imageUrl;
    }
     await restaurant.save()
     res.status(StatusCodes.OK).json(restaurant)
   }catch(error){
    console.log("error",error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Soemthing went wrong"})
   }
}

const getMyRestaurantOrders = async (req:Request,res:Response)=>{
  try{
    const restaurant = await Restaurant.findOne({user:req.userId});
    if(!restaurant){
      return res.status(404).json({message:"restaurant not found"});
    }
    const orders = await Order.find({restaurant:restaurant._id})
    .populate("restaurant")
    .populate("user");

    res.status(200).json(orders)
   
  }catch(error){
    console.log(error)
    res.status(500).json({message:"something went wrong"});
  }
}

const updateOrderRestaurantStatus = async(req:Request,res:Response)=>{
   try{
      const {orderId} = req.params;
      const {status} = req.body;
      const order = await Order.findById(orderId)
      if(!order){
        return res.status(404).json({message:"order not found"});
      }
      const restaurant = await Restaurant.findById(order.restaurant);
      if(restaurant?.user?._id.toString() !== req.userId){
        return res.status(401).send();
      }

      order.status = status;
      await order.save();
      res.status(200).json(order);
   }catch(error){
    console.log(error)
    res.status(500).json({message:"unable to update order status"})
   }
}

const uploadImage = async (file:Express.Multer.File)=>{
  const image = file
  const base64Image = Buffer.from(image.buffer).toString("base64")
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
}



export default {
    createRestuarant,
    GetRestuarant,
    UpdateRestuarant,
    getMyRestaurantOrders,
    updateOrderRestaurantStatus
}