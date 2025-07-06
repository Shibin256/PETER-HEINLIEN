import React, { useEffect } from 'react';
import AddressCard from '../../../components/user/AdressCard';
import Title from '../../../components/common/Title';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAddress, removeAddress, setDefault } from '../../../features/accountSettings/accountSlice';
import { toast } from 'react-toastify';
import { setUser } from '../../../features/auth/authSlice';
import EditAddressModal from '../../../components/common/EditAddress';
import { useState } from 'react';


const Address = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { addresses } = useSelector(state => state.account);
  console.log(addresses);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    dispatch(getAllAddress(user._id));
  }, []);

  const handleEdit = (addr) => {
    setSelectedAddress(addr);
    setEditModalOpen(true);
  };

  const handleRemove = async (addrId) => {
    try {
      const resultAction = await dispatch(removeAddress({ userId: user._id, addressId: addrId })).unwrap();
      if (resultAction) {
        toast.success('Address removed');
        dispatch(getAllAddress(user._id));
      }
    } catch (error) {
      toast.error('Failed to remove address');
    }
  };

  const handleSetDefault = async (addrId) => {
    try {
      const resultAction = await dispatch(setDefault({ userId: user._id, addressId: addrId })).unwrap();
      if (resultAction) {
        toast.success('Default address set');
        dispatch(getAllAddress(user._id));
      }
    } catch (error) {
      toast.error('Failed to set default address');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Title text1={'Your'} text2={'addresses'} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr._id}>
            <AddressCard
              name={addr.name}
              address={addr.house}
              po={addr.locality}
              city={addr.city}
              state={addr.state}
              pin={addr.pincode}
              phone={addr.phone}
              altPhone={addr.alternativePhone}
              defaultAddress={addr.defaultAddress}
              onEdit={() => handleEdit(addr)}
              onRemove={() => handleRemove(addr._id)}
              onSetDefault={() => handleSetDefault(addr._id)}
            />
          </div>
        ))}
        <Link to={'/add-address'}>
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Add New Address</p>
          </div>
        </Link>
      </div>

      {/* Edit Modal */}
      {editModalOpen && selectedAddress && (
        <EditAddressModal
          address={selectedAddress}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedAddress(null);
          }}
          onSuccess={() => {
            setEditModalOpen(false);
            dispatch(getAllAddress(user._id));
          }}
        />
      )}
    </div>
  );
};

export default Address;
