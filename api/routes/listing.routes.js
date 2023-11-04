import express from 'express'
import { createListing, updateListing } from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';


const router = express.Router()

router.post('/create', verifyUser, createListing)
router.post('/update/:id', verifyUser, updateListing)
export default router;