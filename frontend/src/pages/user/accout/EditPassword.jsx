import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import usePasswordVal from '../../../usePasswordVal';
import MainThemeButton from '../../../components/common/MainThemeButton';
import AuthInput from '../../../components/common/AuthInput';
import axiosInstance from '../../../api/axiosInstance';
import { changePassword } from '../../../features/accountSettings/accountSlice';
import { setUser } from '../../../features/auth/authSlice';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const EditPassword = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation()
  const profileData = location.state?.profileData
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      const validationMsg = usePasswordVal(value);
      setError(validationMsg);
      setIsPasswordValid(!validationMsg);
    }

    if (name === 'confirmPassword') {
      if (!isPasswordValid) {
        setError('Enter a valid password first.');
        return;
      }
      if (formData.newPassword !== value) {
        setError('Passwords do not match');
      } else {
        setError('');
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        toast.error('All fields are required');
        return;
      }

      const validationMsg = usePasswordVal(formData.newPassword);
      if (validationMsg) {
        setError(validationMsg);
        setIsPasswordValid(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // ✅ Use await
      const res = await dispatch(changePassword({ userId: profileData.id, data: formData }));
      console.log(res, 'in change password res')

      const message = res.payload;
      const updatedUser = res.payload?.data;
      if (message) {
        toast.error(message);
      }

      if (updatedUser) {
        dispatch(setUser({ user: updatedUser }));
        localStorage.setItem('user', JSON.stringify(updatedUser));
        navigate('/my-profile');
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Change Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Update your password securely below</p>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <AuthInput
            label="Current Password"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
            width="w-full"
            Textcolor="text-gray-700"
            borderColor="border-gray-300"
          />

          <div className="relative">
            <AuthInput
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
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

          <MainThemeButton loading={loading} page="Save Changes" width="w-full" type="submit" />
        </form>
          <br />
        <div className="flex items-center justify-end">
          <Link
            to="/reset-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
};

export default EditPassword;
