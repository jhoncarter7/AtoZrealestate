import express from 'express'
import { deleteUser, deleteUserListing, fetchUser, getUser, updateUser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';
import { getUserListings } from '../controllers/user.controller.js';

const router = express.Router()

router.get('/test', fetchUser)
router.post('/update/:id', verifyUser, updateUser)
router.delete('/delete/:id', verifyUser, deleteUser)
router.get('/listings/:id', verifyUser, getUserListings)
router.delete('/listing/delete/:id', verifyUser, deleteUserListing)
router.get('/:id', verifyUser, getUser)
export default router;