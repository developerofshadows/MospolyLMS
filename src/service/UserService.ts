import bcrypt from 'bcrypt'
import tokenService from './TokenService'
import UserModel from '../models/user-model'
import UserDTO from '../DTO/UserDto'
import ApiError from '../exceptions/ApiError'

class UserService {
    async login(login:string,password:string){
        const user = await UserModel.findOne({login})
        if(!user){
            throw ApiError.BadRequest(`Could not find the user with the given login: ${login}`)
        }
        const isPassEql = await bcrypt.compare(password, user.password)
        if(isPassEql){
            throw ApiError.BadRequest(`Incorrect password!`)
        }
        const userDTO = new UserDTO(user);
        const tokens = await tokenService.generateToken({...userDTO});
        await tokenService.saveToken(userDTO.login,tokens.refreshToken);

        return {...tokens,userDTO}
    }

    async logout(refreshToken: string){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken: string){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findOne(tokenFromDB.user)
        const userDTO = new UserDTO(user);
        const tokens = await tokenService.generateToken({...userDTO});
        await tokenService.saveToken(userDTO.login,tokens.refreshToken);

        return {...tokens,userDTO}
    }
}

export = new UserService();