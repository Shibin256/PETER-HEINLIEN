import React, { forwardRef } from 'react';

const AuthInput = forwardRef(
  (
    {
      label,
      type,
      name,
      value,
      onChange,
      placeholder,
      width,
      Textcolor,
      bgcolor,
      borderColor,
      required = true,
      rows,
      icon,
      error, // Add error prop
      disabled = false, // Add disabled prop
    },
    ref
  ) => (
    <div>
      <label className={`block text-sm font-medium ${Textcolor} mb-1`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
          disabled={disabled}
          className={`${width} p-3 border ${borderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent ${bgcolor} ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          rows={rows}
          required={required}
          autoComplete={
            type === 'email'
              ? 'username'
              : type === 'password'
                ? 'current-password'
                : undefined
          }
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {/* Error message display */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-start">
          <svg 
            className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;