import userService from '../service/UserService'
import {Request,Response,NextFunction} from 'express'

class UserController {
    async login(req:Request, res:Response,next:NextFunction){
        try{
            const {login,password} = req.body;
            const userData = await userService.login(login,password)
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData);
        }
        catch(e){
            next(e);
        }
    }

    async logout(req:Request, res:Response,next:NextFunction){
        try{
            const refreshToken = req.cookies?.refreshToken;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200);
        }
        catch(e){
            next(e);
        }
    }

    async refresh(req:Request, res:Response,next:NextFunction){
        try{
            const refreshToken = req.cookies?.refreshToken;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData);
        }
        catch(e){
            next(e);
        }
    }

    async reset(req:Request, res:Response,next:NextFunction){
        try{

        }
        catch(e){
            next(e);
        }
    }
}

export = new UserController();