import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const  baseUrl= import.meta.env.VITE_API_BASE_URL;
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const OTPForm = () => {
  const navigate=useNavigate()
  const location = useLocation();
  const formData = location.state?.formData;
  const [timeLeft, setTimeLeft] = useState(600);
  const [isExpired, setIsExpired] = useState(false);
  const [userOTP, setUserOTP] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  //prevent restart timer from reload
  useEffect(()=>{
    const storedExpiry=localStorage.getItem('otpExpiry')
    if(storedExpiry){
      const timeRemaining = Math.floor((Number(storedExpiry) - Date.now()) / 1000);
      if(timeRemaining>0){
        setTimeLeft(timeRemaining);
      }else{
         setIsExpired(true);
      }
   }else{
     setIsExpired(true);
   }
  },[])

  
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true); 
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);



  const handleResend=async()=>{
      try {
        const response = await axios.post(`${baseUrl}/api/auth/register`, formData);
        if(response){
          const expiry = Date.now() + 600000; // 10 minutes from now
          localStorage.setItem('otpExpiry', expiry);
          setTimeLeft(600)
          setIsExpired(false);
          toast.success('OTP send to the email adress')
          console.log('resended otp')
        }
      } catch (error) {
        console.log(error)
      }
  }


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, '');
    const newOTP = [...userOTP];
    newOTP[index] = val;
    setUserOTP(newOTP);
    // Move focus to next input if value is not empty and not the last box
    if (val && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !userOTP[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async() => {
    const otp = userOTP.join('');
    console.log('Submitted OTP:', otp);
    const response=await axios.post(`${baseUrl}/api/auth/verifyOTP`,{formData,otp})
    const {user}=response.data
    console.log("User registered:", user);
    navigate('/login')
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 border border-gray-300 w-full max-w-md font-roboto">
        <h2 className="text-2xl font-semibold text-center mb-6 font-georgia">OTP Verification</h2>
        <p className="text-center text-gray-600 mb-4">Enter the 6-digit OTP sent to your email</p>
        <p className="text-center text-gray-400 mb-6">
          Time remaining: {formatTime(timeLeft)}
        </p>
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={userOTP[index]}
                disabled={isExpired}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            ))}
          </div>
          <button
            disabled={isExpired}
            className="w-full bg-teal-900 text-white py-2 rounded hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
          >
            Verify
          </button>
          <div className="text-center text-sm text-blue-500">
            <a onClick={handleResend} className="cursor-pointer">Resend OTP</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPForm;
