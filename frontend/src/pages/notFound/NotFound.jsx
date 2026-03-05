import { FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FiAlertTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-gray-600">Page not found</p>

        <Link
          to="/"
          className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
