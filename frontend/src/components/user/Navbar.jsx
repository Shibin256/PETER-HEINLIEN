import { useEffect, useState } from 'react';
import { FaSearch, FaShoppingCart, FaHeart, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import navlogo from '../../assets/navlogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { HiArrowLeftOnRectangle } from 'react-icons/hi2';
import { logout } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCart } from '../../features/cart/cartSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch])

  const { cartItems = [] } = useSelector(state => state.cart)
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <header className="text-white shadow-md sticky top-0 z-50" style={{ backgroundColor: '#003543' }}>
      <div className="container mx-auto flex flex-wrap md:flex-nowrap justify-between items-center px-4 sm:px-6 lg:px-20 py-4">

        {/* Logo and Hamburger */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <div className="flex items-center">
            <Link to='/'><img src={navlogo} alt="Logo" className="w-[150px] h-[50px] mr-2 object-contain" /></Link>
          </div>

          {/* Hamburger button */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation links */}
        <nav
          className={`w-full md:w-auto md:flex md:items-center md:justify-center mt-4 md:mt-0 ${isOpen ? 'block' : 'hidden'
            }`}
        >
          <a href="/" className="block md:inline-block px-3 py-2 hover:text-teal-200 transition-colors">HOME</a>
          <a href="/collection" className="block md:inline-block px-3 py-2 hover:text-teal-200 transition-colors">SHOP</a>
          <a href="/about" className="block md:inline-block px-3 py-2 hover:text-teal-200 transition-colors">ABOUT US</a>
          <a href="/contact" className="block md:inline-block px-3 py-2 hover:text-teal-200 transition-colors">CONTACT US</a>
        </nav>

        {/* Icons */}
        <div
          className={`flex space-x-5 mt-4 md:mt-0 ${isOpen ? 'block w-full border-t border-teal-800 pt-4 md:border-0 md:pt-0 md:flex' : 'hidden md:flex'
            }`}
        >
          <a href="/my-account" className="hover:text-teal-200 transition-colors text-xl"><FaUser /></a>
          <div className="relative">
            <a href="/cart" className="hover:text-teal-200 transition-colors text-xl">
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </a>
          </div>
          <a href="/wishlist" className="hover:text-teal-200 transition-colors text-xl"><FaHeart /></a>
          <button onClick={handleLogout}><HiArrowLeftOnRectangle className="hover:text-teal-200 transition-colors text-xl" /></button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;