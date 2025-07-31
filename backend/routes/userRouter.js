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
import { addFromWishlistToCart, addItemToCart, getCart, removeCartItem, updateCartItem } from '../controller/cartController.js';
import { cancelOrderItem, cancelOrderSingleItem, changeOrderStatus, downloadInvoice, getOrders, placeOrder, returnOrderItem, verifyCancel } from '../controller/orderController.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controller/paymentController.js';
import { applyCoupon, fetchCoupons, removeCoupon } from '../controller/admin/couponsController.js';
import { addToWallet, getWallet } from '../controller/walletController.js';

const router = express.Router();
const storage=multer.diskStorage({})
const upload=multer({storage})

//wishlist manage
router.post('/wishlist/add',verifyAccessToken, addToWishlist);
router.post('/wishlist/remove',verifyAccessToken, removeFromWishlist);
router.get('/wishlist/:userId',verifyAccessToken, getUserWishlist);
router.get('/wishlist/check/:userId/:productId',verifyAccessToken,getWishedProduct)


//Account manage
router.patch('/account/:id',verifyAccessToken,upload.none(),changeName)
router.patch('/account/editMobile/:id',verifyAccessToken,upload.none(),changeOrAddMobile)
router.patch('/account/editPassword/:id',verifyAccessToken,editPassword)
router.patch('/account/editImage/:id',verifyAccessToken,upload.single('file'),editImage)
router.post('/account/addAddress/:id',verifyAccessToken,addAddress)
router.post('/account/getAllAddress/:id',verifyAccessToken,getAllAddress)
router.delete('/account/removeAddress/:userId/:addressId',verifyAccessToken,removeAddress)
router.patch('/account/setDefault/:userId/:addressId',verifyAccessToken,SetDefaultAddress)
router.put('/account/updateAddress/:addressId',verifyAccessToken,updateAddress)


//cart manage
router.post('/cart/add',verifyAccessToken,addItemToCart)
router.get('/cart/:userId',verifyAccessToken,getCart)
router.delete('/cart/:userId/:productId',verifyAccessToken,removeCartItem)
router.put('/cart/update',verifyAccessToken,updateCartItem)
router.post('/cart/wishlistToCart',verifyAccessToken,addFromWishlistToCart)



//order manage
router.post('/orders/placeOrder',verifyAccessToken,placeOrder)
router.get('/orders/:userId',verifyAccessToken,getOrders)
router.post('/orders/cancelItem',verifyAccessToken,cancelOrderItem)
router.post('/orders/cancelSingleItem',verifyAccessToken,cancelOrderSingleItem)
router.post('/orders/returnItem/:itemOrderId',verifyAccessToken,returnOrderItem) //this is for user side
router.get('/invoice/:orderId',verifyAccessToken,downloadInvoice)

router.post('/create-order',verifyAccessToken,createRazorpayOrder)
router.post('/verify-payment',verifyAccessToken,verifyRazorpayPayment,fetchCoupons)


router.post('/coupons/applyCoupon', verifyAccessToken,applyCoupon);
router.delete('/coupons/:couponId', verifyAccessToken, removeCoupon);


router.post('/wallet/:userId/:amount/:paymentId',verifyAccessToken,addToWallet)
router.get('/wallet/:userId',verifyAccessToken,getWallet)

export default router;
