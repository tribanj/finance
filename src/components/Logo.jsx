import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 group transition-all duration-300 hover:opacity-90"
    >
      {/* Symbol */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-purple-600 blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
        <svg 
          className="w-10 h-10 text-teal-400" 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M24 4L44 40H4L24 4Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36Z" 
            fill="url(#gradient)"
          />
          <defs>
            <linearGradient 
              id="gradient" 
              x1="12" 
              y1="12" 
              x2="36" 
              y2="36" 
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2DD4BF" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
          LCMF
        </span>
        <span className="text-xs font-medium text-gray-300 -mt-1 hidden md:block">
          Life Comrade MicroFinserv
        </span>
      </div>
    </Link>
  );
};

export default Logo;