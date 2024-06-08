import { NextFunction, Request, Response } from "express"
import { auth } from "express-oauth2-jwt-bearer"
import { StatusCodes } from "http-status-codes"
import  jwt,{ JwtPayload } from "jsonwebtoken"
import User from "../model/user"

declare global{
    namespace Express{
        interface Request{
            userId:string,
            auth0Id:string
        }
    }
}

const authMiddleware = auth({
        audience:process.env.AUTH0_AUDIENCE,
        issuerBaseURL:process.env.AUTH0_ISSUER_BASE_URL,
        tokenSigningAlg: 'RS256'
})

export default authMiddleware

export const jwtParse =async(req:Request,res:Response,next:NextFunction)=>{
    const {authorization} = req.headers;
    if(!authorization || !authorization.startsWith("Bearer ")){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:"Unauthorized!!"})
    }
    try{
      const token = authorization.split(" ")[1]
      const decoded = jwt.decode(token) as JwtPayload;
      const auth0Id = decoded.sub
      const user = await User.findOne({auth0Id})
      if(!user){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:"Unauthorized"})
      }
      req.auth0Id = auth0Id as string;
      req.userId = user._id.toString();
      next()
    }catch(error){
       res.status(StatusCodes.BAD_REQUEST);
    }
}