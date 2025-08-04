import React from "react";
import image from "../../assets/pexels-javon-swaby-197616-2783873.jpg";
import { ShieldCheck, ShoppingCart, Headset } from "lucide-react"; // using lucide icons

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* About Us Section */}
      <section className="about-us">
        <h2 className="text-4xl font-extrabold text-center mb-10 tracking-tight text-gray-800">
          About Us
        </h2>
        <div className="flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Image */}
          <div className="flex-1">
            <img
              src={image}
              alt="Man wearing a watch"
              className="w-full max-w-[500px] h-[500px] object-cover rounded-xl shadow-lg mx-auto"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 text-gray-700 leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              About Peter Henlein
            </h3>
            <p>
              Peter Henlein was founded out of a deep appreciation for
              craftsmanship, precision, and the enduring appeal of timepieces.
              Named in honor of the inventor often credited with creating the
              first portable watch, our brand carries forward a legacy of
              innovation and elegance.
            </p>
            <p>
              Our vision was simple: to build a platform where customers can
              easily explore and purchase high-quality watches from the comfort
              of their home. We aim to offer a carefully curated selection that
              celebrates both timeless tradition and modern design.
            </p>
            <h3 className="text-2xl font-bold text-gray-900">What We Offer</h3>
            <p>
              At Peter Henlein, we bring together a diverse range of watches
              that reflect style, functionality, and lasting quality. Whether
              you're looking for a refined dress watch, a bold chronograph, or a
              reliable everyday timepiece, our collection is designed to meet
              every taste and lifestyle.
            </p>
            <p>
              Each product is sourced from trusted brands and skilled
              watchmakers who share our commitment to excellence.
            </p>
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p>
              Our mission is to empower customers with choice, trust, and
              convenience. At Peter Henlein, we're committed to delivering a
              seamless shopping experience—from browsing and selection to
              checkout and delivery.
            </p>
            <p>
              By combining quality products with attentive customer service, we
              strive to make every purchase not just a transaction, but a
              lasting connection with time itself.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us mt-20">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center space-y-4">
            <ShieldCheck className="w-10 h-10 mx-auto text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Quality Assurance
            </h3>
            <p className="text-gray-600">
              We meticulously select and vet each product to ensure it meets our
              stringent quality standards.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center space-y-4">
            <ShoppingCart className="w-10 h-10 mx-auto text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Convenience</h3>
            <p className="text-gray-600">
              With our user-friendly interface and hassle-free ordering process,
              shopping has never been easier.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center space-y-4">
            <Headset className="w-10 h-10 mx-auto text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Exceptional Support
            </h3>
            <p className="text-gray-600">
              Our team of dedicated professionals is here to assist you.
              Ensuring your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
