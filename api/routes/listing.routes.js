import express from 'express'
import { createListing, getListing, getListings, updateListing } from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';


const router = express.Router()

router.post('/create', verifyUser, createListing)
router.post('/update/:id', verifyUser, updateListing)
router.get('/get/:id', getListing)
router.get('/get', getListings)
export default router;