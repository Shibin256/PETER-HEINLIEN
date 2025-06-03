const RadioGroup = ({ label, name, options, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-6">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="h-4 w-4 text-teal-600 focus:ring-teal-300"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
