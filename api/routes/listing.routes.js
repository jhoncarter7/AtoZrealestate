import express from 'express'
import { createListing, getListing, updateListing } from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';


const router = express.Router()

router.post('/create', verifyUser, createListing)
router.post('/update/:id', verifyUser, updateListing)
router.get('/get/:id', getListing)
export default router;