import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CustomApiError";

class UnAuthorizedError extends CustomApiError{
    statusCode:number
    constructor(message:any){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

export default UnAuthorizedError;