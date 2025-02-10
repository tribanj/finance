import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
// import Nav from './Nav'; // Make sure to import your Nav component

const Contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "7e6dc462-9d76-42ec-83fc-beedf5594eab");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        console.error("Error", data);
        setResult(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* <Nav /> */}
      <div className="min-h-screen bg-gray-900 text-gray-100 py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold flex items-center space-x-3">
                <FaEnvelope className="text-cyan-400" />
                <span>Send us a message</span>
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We're here to help and answer any questions you might have. We
                look forward to hearing from you!
              </p>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                  <FaEnvelope className="text-cyan-400 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-400">
                      sharmaravikant02022002@gmail.com
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <FaPhoneAlt className="text-cyan-400 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-400">+91 7007141908</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="text-cyan-400 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-400">
                      Mukharjee Nagar Delhi 
                      <br />
                      Delhi 
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Your Name"
                    required
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter Your Phone Number"
                    required
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    rows="6"
                    placeholder="Enter your message"
                    required
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Submit
                </button>
                {result && (
                  <div className="mt-4 text-center text-sm">{result}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
