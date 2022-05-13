import {Router} from 'express'
import UserController from './controllers/UserController'

const router = Router()

router.post('/auth/login',UserController.login)
router.post('/auth/logout',UserController.logout)
router.post('/auth/refresh',UserController.refresh)
router.post('/auth/reset',UserController.reset)

export default router