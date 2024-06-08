import { body,validationResult} from "express-validator";
import { Response,Request,NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const handleValidationErrors =  async(req:Request,res:Response,next:NextFunction)=>{
   const errors = validationResult(req)
   if(!errors.isEmpty()){
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
}
next()
}

export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("city must be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationErrors
]