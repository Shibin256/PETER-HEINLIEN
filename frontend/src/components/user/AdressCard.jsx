
const AddressCard = ({ name, address, altPhone, po, city, state, pin, phone, defaultAddress, onEdit, onRemove, onSetDefault }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center">
        {defaultAddress && <span className="text-sm font-semibold text-teal-600">Default: PETER HEINLIEN</span>}
      </div>
      <div className="mt-2 flex-grow">
        <p className="font-bold">{name}</p>
        <p>{address} ({po})</p>
        <p>{city}, {state} {pin}</p>
        <p>India</p>
        <p>Phone number: {phone}</p>
        <p>alternativePhone:{altPhone}</p>
        {/* <p className="text-gray-500">Add delivery instructions</p> */}
      </div>
      <div className="mt-4 flex space-x-2">
        <button onClick={onEdit} className="text-blue-600 hover:underline px-2">Edit</button> |
        <button onClick={onRemove} className="text-red-600 hover:underline px-2">Remove</button> |
        {!defaultAddress && <button onClick={onSetDefault} className="text-green-600 hover:underline">Set as Default</button>}
      </div>
    </div>
  );
};

export default AddressCard