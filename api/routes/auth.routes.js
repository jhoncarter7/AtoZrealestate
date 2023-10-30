import express from "express"
import { googleAuth, signIn, signOut, signUp } from "../controllers/auth.controller.js"

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/google', googleAuth)
router.get('/signout', signOut)

export default router