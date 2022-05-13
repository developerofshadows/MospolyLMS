import {Schema,model} from 'mongoose'

const UserSchema = new Schema({
    email: {type: String,unique: true,required: true},
    login: {type: String,unique: true,required: false},
    password: {type: String,required: true}
})  

export = model('User', UserSchema)