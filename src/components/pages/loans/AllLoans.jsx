// import React from "react";
import HomeLoan from "./HomeLoan";
import GoldLoan from "./GoldLoan";
import PersonalLoan from "./PersonalLoan";

// A simple divider using an SVG wave for visual separation between sections
const Divider = () => {
  return (
    <div className="relative">
      <svg viewBox="0 0 1440 320" className="w-full">
        <path
          fill="#a16cb8" // Tailwind's gray-800
          fillOpacity="0.5"
          d="M0,256L1440,128L1440,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

function AllLoans() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Personal Loan Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-4xl font-bold mb-6">
            Personal Loans
          </h2>
          <PersonalLoan />
        </div>
      </section>

      <Divider />

      {/* Gold Loan Section */}
      <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-4xl font-bold mb-6">Gold Loans</h2>
          <GoldLoan />
        </div>
      </section>
      <Divider />

      {/* Home Loan Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-4xl font-bold mb-6">Home Loans</h2>
          <HomeLoan />
        </div>
      </section>
    </div>
  );
}

export default AllLoans;
