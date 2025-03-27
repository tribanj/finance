// import React from 'react';

import { Link } from "react-router-dom";
import goldloanimg from "../../../assets/gold-lone.avif";
import goldLoanFoarm from "../../../assets/life comrade microfinserve GOLD loan_form.pdf";

function GoldLoan() {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-8">
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold animate-fadeIn">
            Unlock the Value of Your Gold
          </h1>
          <p className="text-lg md:text-xl text-gray-300 animate-fadeIn delay-100">
            Secure a quick loan against your gold assets with flexible terms and
            competitive rates. Our gold loans provide a hassle-free way to
            access funds without selling your precious metals.
          </p>
          <div className="flex space-x-4 animate-fadeIn delay-200">
            <Link to='/apply-loan'
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 transition duration-300 rounded-full text-white font-semibold shadow-lg"
            >
              Apply Now
            </Link>
            <a
              href="/learn-more"
              className="px-6 py-3 border border-cyan-500 hover:bg-cyan-500 transition duration-300 rounded-full text-cyan-500 hover:text-white font-semibold shadow-lg"
            >
              Learn More
            </a>
            <a
              href={goldLoanFoarm}
              className="px-6 py-3 border border-cyan-500 hover:bg-cyan-500 transition duration-300 rounded-full text-cyan-500 hover:text-white font-semibold shadow-lg"
            >
              Download Form
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center animate-pulse">
          <img
            src={goldloanimg} // Ensure this image exists in your public/assets folder
            alt="Gold Loan"
            className="max-w-md rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105  hover:bg-[#3b403c] transition duration-300">
            <h3 className="text-2xl font-bold mb-2">Secure Financing</h3>
            <p className="text-gray-300">
              Leverage your gold assets securely and efficiently.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:bg-[#3b403c] transition duration-300">
            <h3 className="text-2xl font-bold mb-2">Quick Approval</h3>
            <p className="text-gray-300">
              Experience fast processing and instant approval for your gold
              loan.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:bg-[#3b403c] transition duration-300">
            <h3 className="text-2xl font-bold mb-2">Flexible Repayments</h3>
            <p className="text-gray-300">
              Choose repayment options that suit your financial situation.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Why Choose Our Gold Loans?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Our gold loans offer the perfect blend of security, speed, and
          flexibility. Access funds quickly while retaining ownership of your
          valuable assets.
        </p>
        <a
          href="/apply-loan"
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 transition duration-300 rounded-full text-white font-semibold shadow-lg"
        >
          Get Started Today
        </a>
      </section>
    </div>
  );
}

export default GoldLoan;
