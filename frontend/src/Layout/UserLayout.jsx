import React from 'react'
import Navbar from '../components/user/Navbar'
import Footer from '../components/user/Footer'
import { Outlet } from 'react-router-dom'
const UserLayout = () => {
  return (
    <div className="flex flex-col font-serif min-h-screen">
      <Navbar/>
       <main className="flex-grow">
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}

export default UserLayout
