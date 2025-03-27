// import React from 'react';
import { Link } from "react-router-dom";
import homeloneimg from "../../../assets/home-lones.jpeg";
import homeloanForm from "../../../assets/life comrade microfinserve Home loan_form.pdf";

function HomeLoan() {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-8">
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold animate-fadeIn">
            Home Loans Made Easy
          </h1>
          <p className="text-lg md:text-xl text-gray-300 animate-fadeIn delay-100">
            Experience the easiest way to finance your dream home. Our home
            loans offer competitive rates, flexible terms, and personalized
            solutions tailored just for you.
          </p>
          <div className="flex space-x-4 animate-fadeIn delay-200">
            <a
              href="/apply-loan"
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 transition duration-300 rounded-full text-white font-semibold shadow-lg"
            >
              Apply Now
            </a>
            <a
              href="/learn-more"
              className="px-6 py-3 border border-cyan-500 hover:bg-cyan-500 transition duration-300 rounded-full text-cyan-500 hover:text-white font-semibold shadow-lg"
            >
              Learn More
            </a>

            <a
              href={homeloanForm}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 transition duration-300 rounded-full text-white font-semibold shadow-lg"
            >
              Download Form
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center animate-pulse">
          <img
            src={homeloneimg}
            alt="Home Loan"
            className="max-w-md rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:bg-[#3b403c] transition duration-300">
            <h3 className="text-2xl font-bold mb-2">Competitive Rates</h3>
            <p className="text-gray-300">
              Get the best rates in the market to make your dream home
              affordable.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:bg-[#3b403c] transition duration-300">
            <h3 className="text-2xl font-bold mb-2">Flexible Terms</h3>
            <p className="text-gray-300">
              Choose a repayment plan that suits your financial needs and future
              goals.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:bg-[#3b403c] transition duration-300">
            <h3 className="text-2xl font-bold mb-2">Quick Approval</h3>
            <p className="text-gray-300">
              Experience fast and hassle-free loan processing with minimal
              documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Why Choose Our Home Loans?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          We believe in making home ownership accessible to everyone. With our
          personalized services and transparent processes, your journey to
          owning a home is just a click away.
        </p>
        <Link
          to="/apply-loan"
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 transition duration-300 rounded-full text-white font-semibold shadow-lg"
        >
          Get Started Today
        </Link>
      </section>
    </div>
  );
}

export default HomeLoan;
