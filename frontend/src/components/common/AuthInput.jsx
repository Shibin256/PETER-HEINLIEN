import React, { forwardRef } from "react";

const AuthInput = forwardRef(({
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
}, ref) => (
  <div>
    <label className={`block text-sm font-medium ${Textcolor} mb-1`}>
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        ref={ref} // ✅ works now
        className={`${width} p-3 border ${borderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent ${bgcolor}`}
        rows={rows}
        required={required}
        autoComplete={
          type === "email"
            ? "username"
            : type === "password"
              ? "current-password"
              : undefined
        }
      />
      {icon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
          {icon}
        </div>
      )}
    </div>
  </div>
));

export default AuthInput;
