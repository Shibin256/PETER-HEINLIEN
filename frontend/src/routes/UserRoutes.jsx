import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/user/Login'
import UserLayout from '../Layout/UserLayout'
import Signup from '../pages/user/Signup'
import Home from '../pages/user/Home'
import About from '../pages/user/About'
import OTPForm from '../pages/user/OtpVerification'
import Cart from '../pages/user/Cart'
import Collection from '../pages/user/Collection'
import Product from '../pages/user/Product'
import Placeorder from '../pages/user/PlaceOrder'
import Orders from '../pages/user/Orders'

const UserRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<UserLayout/>}>
        <Route path='login' element={<Login />}/>
        <Route path='register' element={<Signup/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='collection' element={<Collection/>}/>
        <Route path='about' element={<About/>}/>
        </Route>
      </Routes>
      
    </div>
  )
}

export default UserRoutes
