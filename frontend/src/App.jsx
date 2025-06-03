import { Navigate, replace, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/user/Navbar'
import Footer from './components/user/Footer'
import Login from './pages/user/Login'
import Home from './pages/user/Home'
import About from './pages/user/About'
import OTPForm from './pages/user/OtpVerification'
import Cart from './pages/user/Cart'
import Collection from './pages/user/Collection'
import Product from './pages/user/Product'
import Placeorder from './pages/user/PlaceOrder'
import Orders from './pages/user/Orders'
import Signup from './pages/user/Signup'
import AdminNav from './components/admin/Navbar'
import AdminSidebar from './components/admin/Sidebar'
import AdminLogin from './pages/admin/Login'



// import { useSelector } from 'react-redux'
// const ProtectedRoute=({children,requireAdmin=false})=>{
//   const {isAuthenticated,isAdmin}=useSelector((state)=>state.auth)
//   if(!isAuthenticated){
//     return <Navigate to='/login' replace/>
//   }
//   if(requireAdmin && !isAdmin){
//     return <Navigate to="/admin-login" replace />;
//   }
//   return children
// }


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    {/* <Navbar/> */}
    {/* <AdminNav/> */}
    <ToastContainer theme='dark' />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Signup/>}/>
      <Route path='/collection' element={<Collection/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/product/:productId' element={<Product/>}/>
      <Route path='/place-order' element={<Placeorder/>}/>
      <Route path='/orders' element={<Orders/>}/>
      <Route path='/verify-otp' element={<OTPForm/>}/>
      <Route path='/dashboard' element={<AdminSidebar/>}/>
      <Route path='/admin-login' element={<AdminLogin/>}/>
    </Routes>
    {/* <Footer/> */}
    </div>
  )
}

export default App
