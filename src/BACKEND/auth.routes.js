import { Router } from 'express'
import { register, login, getMe, registerAdmin, checkGoogleAuth, checkEmailExists, deleteUser, updateUser, getUserIdWithEmail, registerWithGoogle } from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', verifyToken, getMe)
router.post('/register-admin', registerAdmin)
router.post('/google-check', checkGoogleAuth)
router.post('/check-email-exists', checkEmailExists)
router.post('/delete-user', deleteUser)
router.post('/update-user', updateUser)
router.post('/get-user-id-with-email', getUserIdWithEmail)
router.post('/register-google', registerWithGoogle)
export default router