const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          {/* ABOUT US */}
          <div className="">
            <h3 className="text-gray-600 mb-4 font-normal">ABOUT US</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-teal-700 transition-colors">COLLECTIONS</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-700 transition-colors">FOR MEN</a></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-gray-600 mb-4 font-normal">SUPPORT</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-teal-700 transition-colors">KNOWLEDGE BASE</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-700 transition-colors">WALLET</a></li>
            </ul>
          </div>

          {/* CONTACT US */}
          <div>
            <h3 className="text-gray-600 mb-4 font-normal">CONTACT US</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-teal-700 transition-colors">OUR TEAM</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-700 transition-colors">WISHLIST</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">COPYRIGHT © 2025. ALL RIGHTS RESERVED</p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-gray-600 hover:text-teal-700 text-sm transition-colors">TERMS & CONDITIONS</a>
            <a href="#" className="text-gray-600 hover:text-teal-700 text-sm transition-colors">PRIVACY POLICY</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
