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
import Placeorder from '../pages/user/PlaceOrder'
import Orders from '../pages/user/Orders'
import ProtectedRoute from './ProtectedRoute'
import ForgotPass from '../pages/user/ForgotPass'
import OTPFormFrogotpass from '../pages/user/OtpVerifyForgotpass'
import ChangePass from '../pages/user/ChangePass'
import ProductDetails from '../pages/user/ProductDetails'





const UserRoutes = () => {
  
  const navigate = useNavigate();

//  useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     console.log(token)
//     if (token) {
//       navigate('/');
//     }
//   }, []);
  
  
  return (
    <div>
      <Routes>
        <Route path='login' element={<Login />}/>
        <Route path='register' element={<Signup/>}/>
         <Route path='/' element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path='collection' element={<Collection />} />
        <Route path='about' element={<About />} />
        <Route path='cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path='product/:id' element={<ProductDetails />} />
        <Route path='verify-otp' element={<OTPForm />} />
        <Route path='change-password' element={<ChangePass />} />
        <Route path='verify-otp-forgotpass' element={<OTPFormFrogotpass />} />
        <Route path='checkout' element={<ProtectedRoute><Placeorder /></ProtectedRoute>} />
        <Route path='orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path='reset-password' element={<ForgotPass />} />
        
      </Route>
      </Routes>
      
    </div>
  )
}

export default UserRoutes
