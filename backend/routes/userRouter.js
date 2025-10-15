// routes/wishlistRoutes.js
import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getWishedProduct,
} from '../controller/wishlistController.js';
import { verifyAccessToken } from '../middleware/authMiddleware.js';
import { addAddress, changeName, changeOrAddMobile, editImage, editPassword, getAllAddress, removeAddress, SetDefaultAddress, updateAddress } from '../controller/accountController.js';
import multer from 'multer';
import { addFromWishlistToCart, addItemToCart, getCart, removeCartItem, toggleIsLocked, updateCartItem } from '../controller/cartController.js';
import { addReview, cancelOrderItem, cancelOrderSingleItem, downloadInvoice, getOrders, placeOrder, returnOrderItem} from '../controller/orderController.js';
import { createRazorpayOrder, verifyRazorpayPayment, verifyRazorpayPaymentForWallet } from '../controller/paymentController.js';
import { applyCoupon, fetchAdsCoupons, fetchCoupons, removeCoupon } from '../controller/admin/couponsController.js';
import { addToWallet, getWallet } from '../controller/walletController.js';
import { fetchHomeBanner } from '../controller/admin/bannerController.js';
import { validateUserRegistration } from '../validators/authValidators.js';
import { validate } from '../middleware/validationMiddleware.js';
import { validateUsernameChange } from '../validators/nameValidator.js';
import { validateAddress } from '../validators/addressValidator.js';

const router = express.Router();
const storage=multer.diskStorage({})
const upload=multer({storage})

//wishlist manage
router.post('/wishlist',verifyAccessToken, addToWishlist);
router.post('/wishlist/remove',verifyAccessToken, removeFromWishlist);
router.get('/wishlist/:userId',verifyAccessToken, getUserWishlist);
router.get('/wishlist/:userId/:productId',verifyAccessToken,getWishedProduct)


//Account manage
router.patch('/account/:id/name',verifyAccessToken,upload.none(),changeName)
router.patch('/account/:id/mobile',verifyAccessToken,upload.none(),changeOrAddMobile)
router.patch('/account/:id/password',verifyAccessToken,editPassword)
router.patch('/account/:id/image',verifyAccessToken,upload.single('file'),editImage)
router.post('/account/:id/address',verifyAccessToken,validateAddress,validate,addAddress)
router.get('/account/:id/address',verifyAccessToken,getAllAddress)
router.delete('/account/:userId/:addressId',verifyAccessToken,removeAddress)
router.patch('/account/:userId/:addressId/default',verifyAccessToken,SetDefaultAddress)
router.put('/account/:addressId',verifyAccessToken,updateAddress)


//cart manage
router.post('/cart',verifyAccessToken,addItemToCart)
router.get('/cart/:userId',verifyAccessToken,getCart)
router.delete('/cart/:userId/:productId',verifyAccessToken,removeCartItem)
router.put('/cart',verifyAccessToken,updateCartItem)
router.post('/cart/from-wishlist',verifyAccessToken,addFromWishlistToCart)
router.post('/cart/cart-lock/:lock/:userId',verifyAccessToken,toggleIsLocked)


//order manage
router.post('/orders',verifyAccessToken,placeOrder)
router.get('/orders/:userId',verifyAccessToken,getOrders)
router.post('/orders/cancel',verifyAccessToken,cancelOrderItem)
router.post('/orders/item/cancel',verifyAccessToken,cancelOrderSingleItem)
router.post('/orders/:itemOrderId/return',verifyAccessToken,returnOrderItem)
router.get('/invoice/:orderId',verifyAccessToken,downloadInvoice)
router.post('/orders/:itemId/review',verifyAccessToken,addReview) 

//payment
router.post('/payments/razorpay/order',verifyAccessToken,createRazorpayOrder)
router.post('/payments/razorpay/verify',verifyAccessToken,verifyRazorpayPayment)
router.post('/payments/razorpay/wallet/verify',verifyAccessToken,verifyRazorpayPaymentForWallet)



router.post('/coupons', verifyAccessToken,applyCoupon);
router.delete('/coupons/:couponId', verifyAccessToken, removeCoupon);
router.get('/coupons',fetchAdsCoupons)
router.get('/all/coupons',verifyAccessToken,fetchCoupons)



router.post('/wallet/:userId/:amount/:paymentId',verifyAccessToken,addToWallet)
router.get('/wallet/:userId',verifyAccessToken,getWallet)

//banner
router.get('/banner',fetchHomeBanner)


export default router;
