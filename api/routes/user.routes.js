import express from 'express'
import { fetchUser } from '../controllers/user.controller.js';

const router = express.Router()

router.get('/test', fetchUser)

export default router;