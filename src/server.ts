import 'dotenv/config'
import express, {Express} from 'express'
import {Schema,model,connect} from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import path from 'path'
import router from './router'
import {ErrorMiddleware} from './middlewares/ErrorMiddleware'

const app:Express = express();


app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use('/api/v1',router)
app.use(ErrorMiddleware)

app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname + '/../html/index.html'))})

const startServer = async () => {
    try {
        await connect(process.env.MONGODB_URL!) 
        app.listen(process.env.PORT || 1234, () => {console.log( `Server started at http://localhost:${process.env.PORT || 1234}` );} );
    }
    catch (e) {
        console.log(e)
    }
}

startServer()

