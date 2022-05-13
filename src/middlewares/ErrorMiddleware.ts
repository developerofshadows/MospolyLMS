import ApiError from "../exceptions/ApiError"
import {Response,Request,NextFunction} from 'express'

export function ErrorMiddleware(err: ApiError,req: Request,res:Response, next: NextFunction){
    if(err instanceof ApiError){
        return res.status(err.status).json({message:err.message,errors:[err.errors]})
    }   
    return res.status(500).json({message:"Unkown error!"})
}