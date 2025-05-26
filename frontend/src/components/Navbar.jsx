import { useState } from 'react';
import { FaSearch, FaShoppingCart, FaHeart, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import navlogo from '../assets/navlogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="text-white shadow-md sticky top-0 z-50" style={{ backgroundColor: '#003543' }}>
      <div className="container mx-auto flex flex-wrap md:flex-nowrap justify-between items-center px-4 sm:px-6 lg:px-20 py-4">
        
        {/* Logo and Hamburger */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <div className="flex items-center">
            <img src={navlogo} alt="Logo" className="w-[150px] h-[50px] mr-2 object-contain" />
            {/* <span className="text-xl font-semibold">PETER HEINLIEN</span> */}
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
          className={`w-full md:w-auto md:flex md:items-center md:justify-center mt-4 md:mt-0 ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <a href="#" className="block md:inline-block px-3 py-2 hover:text-teal-200 transition-colors">HOME</a>
          <a href="#" className="block md:inline-block px-3 py-2 hover:text-teal-200 transition-colors">SHOP</a>
          <a href="#" className="block md:inline-block px-3 py-2 hover:text-teal-200 transition-colors">ABOUT US</a>
          <a href="#" className="block md:inline-block px-3 py-2 hover:text-teal-200 transition-colors">CONTACT US</a>
        </nav>

        {/* Icons */}
        <div
          className={`flex space-x-5 mt-4 md:mt-0 ${
            isOpen ? 'block w-full border-t border-teal-800 pt-4 md:border-0 md:pt-0 md:flex' : 'hidden md:flex'
          }`}
        >
          {/* <a href="#" className="hover:text-teal-200 transition-colors text-xl"><FaSearch /></a> */}
          <a href="#" className="hover:text-teal-200 transition-colors text-xl"><FaUser /></a>
          <a href="#" className="hover:text-teal-200 transition-colors text-xl"><FaShoppingCart /></a>
          <a href="#" className="hover:text-teal-200 transition-colors text-xl"><FaHeart /></a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;