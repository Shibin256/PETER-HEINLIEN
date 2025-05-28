import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import OTPForm from './pages/OtpVerification'
import SignUpPage from './pages/Signup'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import About from './pages/about'
import Cart from './pages/Cart'
import Product from './pages/product'
import Placeorder from './pages/Placeorder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Collection from './pages/Collection'


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <Navbar/>
    <ToastContainer theme='dark' />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<SignUpPage/>}/>
      <Route path='/collection' element={<Collection/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/product/:productId' element={<Product/>}/>
      <Route path='/place-order' element={<Placeorder/>}/>
      <Route path='/orders' element={<Orders/>}/>

      <Route path='/verify-otp' element={<OTPForm/>}/>
    </Routes>
    <Footer/>
    </div>
  )
}

export default App
