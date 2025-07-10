import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteUser, fetchUsers, toggleUserBlock } from '../../features/users/userSlice';
import { FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';
import AuthInput from '../../components/common/AuthInput';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error, currentPage, totalPages } = useSelector((state) => state.users);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    dispatch(fetchUsers({ page, limit, search: searchTerm }));
  }

  useEffect(() => {
    dispatch(fetchUsers({ page, limit }));
  }, [dispatch, page]);

  const handleToggleBlock = (user) => {
    const action = user.isBlocked ? 'unblock' : 'block';

    Swal.fire({
      title: `Are you sure?`,
      text: `This will ${action} the user.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded mr-2',
        cancelButton: 'bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(toggleUserBlock(user._id)).then((res) => {
          if (res.type.endsWith('/fulfilled')) {
            toast.success(`✅ User ${action}ed successfully!`);
          } else {
            toast.error(res?.error?.message || `Failed to ${action} user.`);
          }
        });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded mr-2',
        cancelButton: 'bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(id)).then((res) => {
          if (res.type.endsWith('/fulfilled')) {
            toast.success('✅ User deleted successfully!');
          } else {
            toast.error(res?.error?.message || 'Failed to delete user.');
          }
        });
      }
    });
  };

  const totalUsers = users?.length || 0;
  const blockedUsers = users?.filter((user) => user.isBlocked)?.length || 0;

  if (loading) return <p className="text-center py-4">Loading users...</p>;
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error?.message || 'An unknown error occurred.';
    return <p className="text-red-500 text-center">{errorMessage}</p>;
  }

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <AuthInput
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders by name..."
            width="w-full md:w-96"
            Textcolor="text-gray-700"
            borderColor="border-gray-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                dispatch(fetchUsers({ page, limit })); // Reset search
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-sm border border-blue-200">
          Total Users: <span className="font-bold">{totalUsers}</span>
        </div>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-sm border border-red-200">
          Blocked Users: <span className="font-bold">{blockedUsers}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
                      {user.profileImage ? (
                        <img className="h-full w-full object-cover" src={user.profileImage} alt="Profile" />
                      ) : (
                        <FaUser className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-1 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToggleBlock(user)}
                      className={`inline-flex items-center px-3 py-1 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${user.isBlocked
                        ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 focus:ring-green-500'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 focus:ring-yellow-500'
                        }`}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    {/* <button
                      onClick={() => handleDelete(user._id)}
                      className="inline-flex items-center px-3 py-1 border border-red-200 rounded-md shadow-sm text-sm font-medium text-red-800 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-center items-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
