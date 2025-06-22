// routes/wishlistRoutes.js
import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getWishedProduct,
} from '../controller/wishlistController.js';

const router = express.Router();

//wishlist manage
router.post('/wishlist/add', addToWishlist);
router.post('/wishlist/remove', removeFromWishlist);
router.get('/wishlist/:userId', getUserWishlist);
router.get('/wishlist/check/:userId/:productId',getWishedProduct)

export default router;
