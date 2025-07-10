import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setUser } from '../../../features/auth/authSlice';
import Swal from 'sweetalert2';
import { deleteUser } from '../../../features/users/userSlice';
import { toast } from 'react-toastify';
import ProfileImageModal from '../../../components/common/ProfileImageModal';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const [showModal, setShowModal] = useState(false);
    const [nameImg,setNameImg]=useState([])
    const [profileData, setProfileData] = useState({
        id: '',
        name: '',
        email: '',
        mobile: '',
        password: '********'
    });

useEffect(() => {
    setProfileData({
        id: user._id,
        name: user.username,
        email: user.email,
        mobile: user.phone,
        password: '********'
    });
    const splitName = user.username.split(' ');
    setNameImg(splitName);
    // setProfilePic(user.profileImage)
}, []);


    const [profilePic, setProfilePic] = useState(null);

    // const handleImageUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setProfilePic(reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleImageSave = (imageData) => {
        setProfilePic(imageData);
    };


    const navigateToEdit = (field) => {
        navigate(`/edit-${field}`, {
            state: {
                profileData,
            }
        });
    };

    //handle logut
    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        navigate("/login");
        toast.success("Logged out successfully");
    }

    //handle delete
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'you will permanently delete from the site.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'Cancel',
            buttonsStyling: false,
            customClass: {
                confirmButton:
                    'bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded mr-2',
                cancelButton:
                    'bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteUser(id)).then((res) => {
                    if (res.type.endsWith('/fulfilled')) {
                        toast.success('✅ User deleted successfully!');
                        dispatch(fetchUsers({ page, limit }));
                    } else {
                        toast.error(res?.error?.message || 'Failed to delete user.');
                    }
                });
            }
        });
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-[#003543]/5 to-white py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Profile Header */}
                <div className="bg-[#003543] py-6 px-8 text-center">
                    <h2 className="text-2xl font-bold text-white">YOUR ACCOUNT</h2>
                </div>

                {/* Profile Picture */}
                <div className="flex flex-col items-center mt-6 relative">
                    <div className="relative group">
                        <img
                            src={user.profileImage || `https://ui-avatars.com/api/?name=${nameImg[0]}+${nameImg[1]}&background=003543&color=fff&size=128`}
                            alt="Profile"
                            className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-lg"
                        />
                        <label
                            onClick={() => setShowModal(true)}
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </label>

                    </div>
                    <h3 className="text-xl font-semibold mt-4 text-[#003543]">{profileData.name}</h3>
                    {/* <p className="text-sm text-gray-500">Premium Member</p> */}
                </div>

                {/* Profile Information */}
                <div className="p-6 space-y-5">
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium text-[#003543]">{profileData.name}</p>
                            </div>
                            <button
                                onClick={() => navigateToEdit('name')}
                                className="text-[#003543] hover:text-[#004d5f] transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-[#003543]">{profileData.email}</p>
                            </div>
                            {/* <button
                                onClick={() => navigateToEdit('email')}
                                className="text-[#003543] hover:text-[#004d5f] transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button> */}
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Mobile</p>
                                <p className="font-medium text-[#003543]">{profileData.mobile}</p>
                            </div>
                            <button
                                onClick={() => navigateToEdit('mobile')}
                                className="text-[#003543] hover:text-[#004d5f] transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Password</p>
                                <p className="font-medium text-[#003543] tracking-widest">{profileData.password}</p>
                            </div>
                            <button
                                onClick={() => navigateToEdit('password')}
                                className="text-[#003543] hover:text-[#004d5f] transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6 flex flex-col space-y-3">
                    <button onClick={handleLogout} className="w-full py-3 bg-[#003543] text-white rounded-lg hover:bg-[#004d5f] transition-colors duration-300 font-medium">
                        LOG OUT
                    </button>
                    <button onClick={handleDelete} className="w-full py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-300">
                        DELETE ACCOUNT
                    </button>
                </div>
            </div>
            <ProfileImageModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleImageSave}
                initialImage={profilePic}
                user={profileData}
            />

        </div>
    );
};

export default Profile;