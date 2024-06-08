import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../model/user";

const updateUser =async (req:Request,res:Response)=>{
    try{
        const {name,addressLine1,country,city} = req.body;
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"User not found"})
        }
        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city,
        user.country = country
        await user.save()
        
        res.status(StatusCodes.OK).json()
    }catch(error){
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Error updating user"})
    }
}

const getUser = async(req:Request,res:Response)=>{
    const userId = req.userId
    try{
     const currentUser = await User.findOne({_id:userId})
     if(!currentUser){
        return res.status(StatusCodes.NOT_FOUND).json({message:"User not found"})
     }
       res.status(StatusCodes.OK).json(currentUser)
    }catch(error){
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Something went wrong")
    }
}

export  {updateUser,getUser};