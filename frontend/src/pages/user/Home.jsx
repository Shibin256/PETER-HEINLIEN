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
  return (
    <div>
      <div>
        <HeroSection/>
        <CategoryProducts/>
        <LatestCollection/>    
        <AdBanner/>    
        <TopRated/>
      </div>
    </div>
  )
}

export default Home
