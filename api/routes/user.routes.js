import express from 'express'
import { fetchUser, updateUser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router()

router.get('/test', fetchUser)
router.post('/update/:id', verifyUser, updateUser)

export default router;