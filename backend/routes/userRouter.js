// routes/wishlistRoutes.js
import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getWishedProduct,
} from '../controller/wishlistController.js';
import { verifyAccessToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//wishlist manage
router.post('/wishlist/add',verifyAccessToken, addToWishlist);
router.post('/wishlist/remove',verifyAccessToken, removeFromWishlist);
router.get('/wishlist/:userId',verifyAccessToken, getUserWishlist);
router.get('/wishlist/check/:userId/:productId',verifyAccessToken,getWishedProduct)

export default router;
