/* eslint-disable react/no-unescaped-entities */
// import React from 'react';

import personalLoanImg from "../../../assets/personal loan.webp";
function PersonalLoan() {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-8">
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold animate-fadeIn">
            Personal Loans Made Simple
          </h1>
          <p className="text-lg md:text-xl text-gray-300 animate-fadeIn delay-100">
            Get quick and hassle-free access to funds for your personal needs—whether it's education, medical expenses, travel, or unexpected emergencies.
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
              href="/"
              className="px-6 py-3 border border-cyan-500 hover:bg-cyan-500 transition duration-300 rounded-full text-cyan-500 hover:text-white font-semibold shadow-lg"
            >
             Download Form 
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center animate-pulse">
          <img
            src={personalLoanImg}  
            alt="Personal Loan"
            className="max-w-md rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:bg-[#3b403c] transition duration-300">
            <h3 className="text-2xl font-bold mb-2">No Collateral Required</h3>
            <p className="text-gray-300">
              Enjoy the freedom of unsecured personal loans with minimal documentation.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:bg-[#3b403c] transition duration-300">
            <h3 className="text-2xl font-bold mb-2">Flexible Repayment Options</h3>
            <p className="text-gray-300">
              Choose a repayment plan that fits your budget and lifestyle, with terms tailored just for you.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:bg-[#3b403c] transition duration-300">
            <h3 className="text-2xl font-bold mb-2">Fast Processing</h3>
            <p className="text-gray-300">
              Experience quick approvals and fast disbursement of funds without unnecessary delays.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Why Choose Our Personal Loans?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Our personal loans are designed to offer you financial flexibility and peace of mind, with transparent processes and competitive rates. Whether you're planning for a big expense or need funds for an emergency, we're here to help.
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

export default PersonalLoan;
