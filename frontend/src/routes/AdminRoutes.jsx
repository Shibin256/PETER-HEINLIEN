import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from '../Layout/AdminLayout'
import AdminLogin from '../pages/admin/Login'
import Dashboard from '../pages/admin/Dashboard'
import AddItem from '../pages/admin/AddItem'
import Customer from '../pages/admin/Customer'
import OrderAdmin from '../pages/admin/OrderAdmin'
import ProductAdmin from '../pages/admin/ProductAdmin'


const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='login' element={<AdminLogin/>}/>
        <Route path='/' element={<AdminLayout />}>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='additems' element={<AddItem/>} />
            <Route path='customers' element={<Customer/>} />
            <Route path='orders' element={<OrderAdmin/>} />
            <Route path='products' element={<ProductAdmin/>} />
        </Route>
        </Routes>
    </div>
  )
}

export default AdminRoutes
