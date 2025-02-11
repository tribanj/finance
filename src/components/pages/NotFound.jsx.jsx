import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center px-6">
      <h1 className="text-6xl font-extrabold text-red-500">404</h1>
      <h2 className="text-3xl font-bold mt-4">Oops! Page Not Found</h2>
      <p className="text-gray-400 mt-2 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-cyan-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-cyan-600 transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;