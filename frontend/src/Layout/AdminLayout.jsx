import React from 'react'
import AdminNav from '../components/admin/Navbar'
import AdminSidebar from '../components/admin/Sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
     <div className="h-screen flex flex-col">
        <AdminNav/>
    
    <div  className="flex flex-1 overflow-hidden">
        <AdminSidebar/>
        <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
    </div>
      
    </div>
  )
}

export default AdminLayout
