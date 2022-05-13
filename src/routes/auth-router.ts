import express from 'express'
import UserController from '../controllers/UserController'

const router = express.Router()

router.post('/login',UserController.login)
router.post('/logout',UserController.logout)
router.post('/refresh',UserController.refresh)
router.post('/reset',UserController.reset)

export default router