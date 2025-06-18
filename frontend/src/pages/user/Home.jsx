import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../../components/user/HeroSection'

import LatestCollection from '../../components/user/LatestCollection'
import CategoryProducts from '../../components/user/CategoryProducts'
import AdBanner from '../../components/user/AdBanner'
import TopRated from '../../components/user/TopRated'

const Home = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const handleLogout=()=>{
    dispatch(logout())
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  }
  
  // const product={
  //   image:heroimg,
  //   name:'shibin',
  //   description:'  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea tenetur omnis temporibus, illo cupiditate sapiente. Illo impedit quidem esse totam debitis odit unde, adipisci, et animi voluptas quas quis magni!',
  //   price:200
  // }
  return (
    <div>
      <div>
        <HeroSection/>
        <CategoryProducts/>
        <LatestCollection/>    
        <AdBanner/>    
        <TopRated/>
      </div>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Home
