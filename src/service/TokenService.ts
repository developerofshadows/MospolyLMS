import jwt from 'jsonwebtoken'
import tokenModel from '../models/token-model'

class TokenService {
    generateToken(payload:object) {
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_TOKEN!,{expiresIn:"30min"})
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_TOKEN!,{expiresIn:"30days"})
        return {accessToken,refreshToken}
    }

    validateAccessToken(token:string){
        try {
            const userData = jwt.verify(token,process.env.JWT_ACCESS_TOKEN!)
            return userData;
        }
        catch (e) {
            return null;
        }
    }

    validateRefreshToken(token:string){
        try {
            const userData = jwt.verify(token,process.env.JWT_REFRESH_TOKEN!)
            return userData;
        }
        catch (e) {
            return null;
        }
    }

    async saveToken(login:string,refreshToken:string){
        const tokenData = await tokenModel.findOne({login})
        if(tokenData){
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({login,refreshToken})
        return token;
    }

    async removeToken(refreshToken:string){
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData;
    }

    async findToken(refreshToken:string){
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData;
    }
}

export = new TokenService();