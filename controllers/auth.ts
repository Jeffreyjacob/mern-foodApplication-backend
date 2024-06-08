import {Request,Response} from 'express'
import { StatusCodes } from 'http-status-codes'
import User from '../model/user';

const CreateUser = async(req:Request,res:Response)=>{
    try{
        const {auth0Id,email} = req.body;
        const existingUser = await User.findOne({auth0Id,email})
        if(existingUser){
            res.status(StatusCodes.CREATED).json({msg:"user already created"})
        }else{
            const newUser = new User(req.body);
            await newUser.save();
            res.status(StatusCodes.CREATED).json({user:newUser.toObject()});
        }
    }catch(error){
       res.status(500).json(error)
    }
}


export default {CreateUser}