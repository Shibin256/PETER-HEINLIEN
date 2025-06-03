const AuthInput=({label, type, name, value, onChange, placeholder,width,Textcolor,bgcolor,borderColor,required = true})=>(
        <div>
             <label className={`block text-sm font-medium ${Textcolor} mb-1`}>{label}</label>
             <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className= {`${width} p-3 border ${borderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent  ${bgcolor}`}
                required={required}
                autoComplete={type === 'email' ? 'username' : type === 'password' ? 'current-password' : undefined}
             />
        </div>
)
export default AuthInput;