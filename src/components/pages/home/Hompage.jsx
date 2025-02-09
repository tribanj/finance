import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    const createNeonCircle = () => {
      const circle = document.createElement('div');
      circle.className = 'absolute w-4 h-4 rounded-full blur-lg opacity-30';
      circle.style.left = `${Math.random() * 100}%`;
      circle.style.top = `${Math.random() * 100}%`;
      circle.style.background = `radial-gradient(circle, 
        ${Math.random() > 0.5 ? '#00f3ff' : '#ff00ff'}, 
        transparent)`;
      document.getElementById('neon-background').appendChild(circle);
    };

    for (let i = 0; i < 50; i++) {
      createNeonCircle();
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Neon Background */}
      <div 
        id="neon-background" 
        className="absolute inset-0 bg-[url('/dark-computer-bg.jpg')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Animated Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
            Next-Gen Financial Solutions
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Revolutionize your financial journey with our AI-powered loan solutions and 
            blockchain-backed security systems.
          </p>

          {/* CTA Button */}
          <button className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-lg font-bold text-white hover:scale-105 transition-transform group">
            <span>Get Started Now</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 animate-pulse -z-10" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-center">
          {[
            { number: '99.9%', label: 'Security Assurance' },
            { number: '24h', label: 'Loan Approval' },
            { number: '1M+', label: 'Happy Customers' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-cyan-400/30 transition-all"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="mt-2 text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/3 right-40 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
    </div>
  );
};

export default HomePage;