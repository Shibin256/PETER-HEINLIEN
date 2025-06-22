import React, { useState } from 'react';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: null, message: '' });

  //form submit for contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (!name || /\d/.test(name)) {
      setStatus({ success: false, message: 'Please enter a valid name without numbers.' });
      return;
    }

    if (!email) {
      setStatus({ success: false, message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    const formData = new FormData(form);
    formData.append('access_key', '008f1964-a55e-41b0-aa2a-39452fa2810f'); // Replace with your Web3Forms key

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      console.log(response)
      setLoading(false);
      if (response.ok) {
        setStatus({ success: true, message: '✅ Message sent successfully!' });
        form.reset();
      } else {
        setStatus({ success: false, message: '❌ Something went wrong. Please try again.' });
      }
    } catch (error) {
      setLoading(false);
      setStatus({ success: false, message: '❌ Network error. Please try again.' });
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-r from-gray-100 to-white rounded-xl shadow-2xl p-8">
        {/* Left Text */}
        <div className="text-gray-800 max-w-md">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-lg mb-4">
            We're here to assist you—whether it's about sizing, styling, your order status, or anything in between.
          </p>
          <p className="text-lg mb-6">
            At Peter Henlein, we believe in timeless service to match our timeless style. Reach out anytime, and our team will get back to you promptly.
          </p>
          <div className="space-y-2 text-gray-700">
            <p>📧 <a href="mailto:peterhenlein@xai.com" className="hover:text-blue-600">peterhenlein@xai.com</a></p>
            <p>📞 +91-8157989254</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6" id="contactForm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" type="text" placeholder="Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="subject" type="text" placeholder="Subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="email" type="email" placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="phone" type="tel" placeholder="Phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <textarea name="message" placeholder="Message"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>

            {loading && <p className="text-blue-600 text-sm">Sending message...</p>}
            {status.message && (
              <p className={`text-sm ${status.success ? 'text-green-600' : 'text-red-600'}`}>
                {status.message}
              </p>
            )}

            <button type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
