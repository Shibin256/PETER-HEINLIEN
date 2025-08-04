const Footer = () => {
  return (
    <footer className="bg-gray-50 py-16 border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo/Brand Section */}
          <div className="md:col-span-1 lg:col-span-2">
            <h2 className="text-2xl font-medium mb-4 text-gray-800">
              PETER HENLEIN
            </h2>
            <p className="text-gray-500 mb-6 max-w-xs">
              Timeless craftsmanship meets modern elegance in every timepiece we
              offer.
            </p>
            <div className="flex space-x-4">
              {["twitter", "facebook", "instagram", "linkedin"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all hover:bg-gray-100"
                  >
                    <span className="sr-only">{social}</span>
                    {/* Replace with actual icons */}
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3 lg:col-span-3">
            {/* ABOUT US */}
            <div>
              <h3 className="text-gray-700 mb-5 uppercase tracking-wider text-sm font-medium relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-teal-600">
                About Us
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/collection"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    Collection
                  </a>
                </li>{" "}
                <li>
                  <a
                    href="/about"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    Our Story
                  </a>
                </li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h3 className="text-gray-700 mb-5 uppercase tracking-wider text-sm font-medium relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-teal-600">
                SUPPORT
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    Payment Options
                  </a>
                </li>{" "}
                <li>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    Track Order
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* CONTACT US */}
            <div>
              <h3 className="text-gray-700 mb-5 uppercase tracking-wider text-sm font-medium relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-teal-600">
                CONTACT US
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    1800-266-01**
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    PeterHeinlien@gmail.in
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    Help & Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            COPYRIGHT © {new Date().getFullYear()} PETER HENLEIN. ALL RIGHTS
            RESERVED
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            <a
              href="#"
              className="text-gray-500 hover:text-teal-600 text-sm transition-colors"
            >
              TERMS & CONDITIONS
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-teal-600 text-sm transition-colors"
            >
              PRIVACY POLICY
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-teal-600 text-sm transition-colors"
            >
              COOKIE POLICY
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
