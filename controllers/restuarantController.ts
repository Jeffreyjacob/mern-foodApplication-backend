import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import Restaurant from "../model/restaurant";


const searchRestuarant = async (req:Request,res:Response)=>{
  try{
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1
    
    let query:any = {};
    query["city"] = new RegExp(city,"i")
    const cityCheck = await Restaurant.countDocuments(query);
    if(cityCheck === 0){
        return res.status(StatusCodes.NOT_FOUND).json({
            data:[],
            pagination:{
                total:0,
                page:1,
                pages:1
            }
        });
    }
    if(selectedCuisines){
        const cuisinesArray = selectedCuisines.split(",").map(
            (cuisine)=> new RegExp(cuisine,"i"));
        query["cuisines"] = {$all:cuisinesArray};
    }
    if(searchQuery){
        const searchRegex = new RegExp(searchQuery,'i')
        query["$or"] = [
            {restaurantName : searchRegex},
            {cuisines: {$in:[searchRegex]}},  
        ]
    }
   const pageSize = 10
   const skip = (page -1) * pageSize
   const restaurant = await Restaurant.find(query).sort({[sortOption]:1}).skip(skip).limit(pageSize).lean();
   
   const total = await Restaurant.countDocuments(query);
   const response = {
     data:restaurant,
     pagination:{
        total,
        page,
        pages:Math.ceil(total/pageSize),
     }
   }
   res.status(200).json(response)
  }catch(error){
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Something went wrong"})
  }
}

const getRestuarant = async (req:Request,res:Response)=>{
       try{
         const restaurantId =  req.params.id
         const restuarant = await Restaurant.findById(restaurantId)
         if(!restuarant){
            return res.status(StatusCodes.NOT_FOUND).json({message:"resturant not found"})
         }
          res.json(restuarant)
       }catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({Message:"something went wrong"})
       }
}

export default {searchRestuarant,getRestuarant}