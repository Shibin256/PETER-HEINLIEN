import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
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
  
  return (
    <div>
      <p>hi there</p>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Home
