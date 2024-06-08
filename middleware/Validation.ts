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

export const validateMyRestuarantRequest = [
    body("restaurantName").notEmpty().withMessage("Restuarant name is required"),
    body("city").notEmpty().withMessage("city name is required"),
    body("country").notEmpty().withMessage("country name is required"),
    body("deliveryPrice").isFloat({min:0}).withMessage("Delivery price must be a positive number"),
    body("estimateDeliveryTime").isInt({min:0}).withMessage("Estimate Delivery Time must be a postive integar"),
    body("cuisines").isArray().withMessage('Cuisine must be an array').not().isEmpty().withMessage("cuisine array cannot be empty"),
    body("menuItems").isArray().withMessage('Menu items must be an array'),
    body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
    body("menuItems.*.price").isFloat({min:0}).withMessage("Menu item price is required and must be positive"),
    handleValidationErrors,
]