// import React from "react";
import founderImg from "../../../assets/about foundder.jpeg";
const About = () => {
  return (
    <div className="min-h-screen pt-20 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 bg-gray-900 text-white">
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <h3 className="text-2xl font-semibold text-teal-400">Founder: Ravikant Sharma</h3>        <p className="text-lg text-gray-300 mb-6">
          We are a trusted finance company providing tailored loan solutions to meet your needs. Our goal is to offer seamless financial services with transparency and efficiency.
        </p>
        <p className="text-lg text-gray-300">
          With years of experience in the industry, we ensure the best rates and services for our customers. Join us today and take a step towards a secure financial future.
        </p>
      </div>
      <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
        <img 
          src={founderImg} 
          alt="About Us" 
          className="w-full max-w-md rounded-lg shadow-lg" 
        />
      </div>
    </div>
  );
};

export default About;
