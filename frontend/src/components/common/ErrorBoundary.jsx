import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
    // You could also log to an error tracking service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <FiAlertTriangle className="text-red-500 text-4xl" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-6">
              {this.state.error?.toString() || "We couldn't load this page properly."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw /> Try Again
              </button>
              {/* <button
                onClick={() => window.location.href = "/"}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FiHome /> Go Home
              </button> */}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Optional: Create a wrapper component to use hooks if needed
export const ErrorBoundaryWithNavigation = (props) => {
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary 
      {...props} 
      navigate={navigate} 
    />
  );
};

export default ErrorBoundary;