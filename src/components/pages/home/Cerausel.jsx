import { useState, useEffect } from "react";
import banner1 from "../../../assets/banner-bg.png";
import banner2 from "../../../assets/GL Image.png";
import banner3 from "../../../assets/banner03.png";
import { Link } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  // const navigate = useNavigate();
  const slides = [
    {
      image: banner1,
      title: "Personal Loans",
      subtitle: "Flexible Financing Solutions",
      text: "Get the funds you need with competitive rates",
    },
    {
      image: banner2,
      title: "Gold Loan",
      subtitle: "Grow Your Enterprise",
      text: "Customized financial solutions for your business",
    },
    {
      image: banner3,
      title: "Home Loan",
      subtitle: "Your Dream Home Awaits",
      text: "Flexible mortgage solutions with low interest rates",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Image with overlay */}
          <div className="relative h-full w-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/80 z-10" />{" "}
            {/* Increased opacity to 60% */}
            {/* Text Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <div className="space-y-6 text-white max-w-4xl">
                <h2 className="text-4xl md:text-6xl font-bold animate-fade-in-up">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-3xl font-medium text-cyan-300 animate-fade-in-up delay-100">
                  {slide.subtitle}
                </p>
                <p className="text-lg md:text-xl text-gray-200 animate-fade-in-up delay-200">
                  {slide.text}
                </p>
                <Link
                  to="/loan-types"
                  className="mt-8 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-full text-lg font-semibold transition-colors duration-300 animate-fade-in-up delay-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeIndex ? "bg-cyan-500" : "bg-white/50"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white hover:text-cyan-400 transition-colors"
        onClick={() =>
          setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
        }
        aria-label="Previous slide"
      >
        ❮
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white hover:text-cyan-400 transition-colors"
        onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
        aria-label="Next slide"
      >
        ❯
      </button>
    </div>
  );
};

export default Carousel;
