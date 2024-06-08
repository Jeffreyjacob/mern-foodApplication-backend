import { StatusCodes } from "http-status-codes"
import { Request,Response,NextFunction } from "express"

const errorHandlerMiddleWare = (err:any,req:Request,res:Response,Next:NextFunction)=>{
  console.log(err)
   let CustomError = {
     statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
     message: err.message || 'Something went wrong'
   }
   return res.status(CustomError.statusCode).json({msg:CustomError.message})
}

export default errorHandlerMiddleWare;