import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from '../pages/user/Login'
import UserLayout from '../Layout/UserLayout'
import Signup from '../pages/user/Signup'
import Home from '../pages/user/Home'
import About from '../pages/user/About'
import OTPForm from '../pages/user/OtpVerification'
import Cart from '../pages/user/Cart'
import Collection from '../pages/user/Collection'
import Orders from '../pages/user/Orders'
import ProtectedRoute from './ProtectedRoute'
import ForgotPass from '../pages/user/ForgotPass'
import OTPFormFrogotpass from '../pages/user/OtpVerifyForgotpass'
import ChangePass from '../pages/user/ChangePass'
import ProductDetails from '../pages/user/ProductDetails'
import Contact from '../pages/user/Contact'
import Wishlist from '../pages/user/Wishlist'
import PublicOnlyRoute from './PublicOnlyRoute'
import CategoryBasedCollection from '../pages/user/CategoryBasedCollection'
import MyAccount from '../pages/user/accout/MyAccount'
import Profile from '../pages/user/accout/Profile'
import EditName from '../pages/user/accout/EditName'
import EditMobile from '../pages/user/accout/EditMobile'
import EditPassword from '../pages/user/accout/EditPassword'
import Address from '../pages/user/accout/Adress'
import AddAddress from '../pages/user/accout/AddAddress'
import Checkout from '../pages/user/Checkout'




const UserRoutes = () => {
    
  return (
    <div>
      <Routes>
        <Route path='login' element={<PublicOnlyRoute><Login /></PublicOnlyRoute>}/>
        <Route path='register' element={<PublicOnlyRoute><Signup/></PublicOnlyRoute>}/>
         <Route path='/' element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path='collection' element={<Collection />} />
        <Route path='about' element={<About />} />
        <Route path='cart' element={<Cart />} />
        <Route path='product/:id' element={<ProductDetails />} />
        <Route path='verify-otp' element={<OTPForm />} />
        <Route path='change-password' element={<ChangePass />} />
        <Route path='verify-otp-forgotpass' element={<OTPFormFrogotpass />} />
        <Route path='orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path='reset-password' element={<ForgotPass />} />
        <Route path='contact' element={<Contact />} />
        <Route path='wishlist' element={<Wishlist />} />
        <Route path='category-collection' element={<CategoryBasedCollection />} />
        <Route path='checkout' element={<Checkout />} />




        <Route path='My-account' element={<MyAccount />} />
        <Route path='My-profile' element={<Profile />} />
        <Route path='edit-name' element={<EditName />} />
        <Route path='edit-mobile' element={<EditMobile />} />
        <Route path='edit-password' element={<EditPassword />} />
        <Route path='my-address' element={<Address />} />
        <Route path='add-address' element={<AddAddress />} />

      </Route>
      </Routes>
      
    </div>
  )
}

export default UserRoutes
