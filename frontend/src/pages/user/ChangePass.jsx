import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import usePasswordVal from '../../usePasswordVal';
import AuthInput from '../../components/common/AuthInput';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import MainThemeButton from '../../components/common/MainThemeButton';

const ChangePass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const email = location.state?.email;
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  //handle the input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // password validation
    if (name === 'password') {
      const validationMsg = usePasswordVal(value);
      setError(validationMsg);
      setIsPasswordValid(!validationMsg);
    }
    if (name === 'confirmPassword') {
      if (!isPasswordValid) {
        setError('Enter a valid password first.');
        return;
      }
      if (formData.password !== value) {
        setError('Passwords do not match');
      } else {
        setError('');
      }
    }
  };

  //handling submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.password || !formData.confirmPassword) {
        toast.error('Both password fields are required');
        setLoading(false);
        return;
      }

      const validationMsg = usePasswordVal(formData.password);
      if (validationMsg) {
        setError(validationMsg);
        setIsPasswordValid(false);
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.patch(`${baseUrl}/api/auth/changePassword`, {
        newPassword: formData.password, email
      });

      toast.success(response.data.message || 'Password reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Set a new password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Create a new password. Ensure it differs from previous ones for security
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <div className="relative">
            <AuthInput
              label="New Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              width="w-full"
              Textcolor="text-gray-700"
              borderColor="border-gray-300"
            />
            {error && (
              <div className="absolute left-0 top-full mt-1 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md px-3 py-2 shadow-md z-10 w-full">
                {error}
                <div className="absolute top-0 left-6 -mt-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-red-100"></div>
              </div>
            )}
          </div>

          <AuthInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            width="w-full"
            Textcolor="text-gray-700"
            borderColor="border-gray-300"
          />

          <MainThemeButton
            loading={loading}
            page="Reset Password"
            width="w-full"
            type="submit"
          />

          <p className="text-center text-sm text-gray-600">
            Back to{' '}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default ChangePass;