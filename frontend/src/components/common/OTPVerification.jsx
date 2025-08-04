// components/common/OTPVerification.jsx
import React, { useEffect, useRef, useState } from "react";

const OTPVerification = ({
  duration = 180,
  onVerify,
  onResend,
  email,
  otpLength = 6,
  resendDisabled = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isExpired, setIsExpired] = useState(false);
  const [userOTP, setUserOTP] = useState(Array(otpLength).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const expiryTime = localStorage.getItem("otpExpiry");
    const now = Date.now();

    if (expiryTime) {
      const remaining = Math.floor((Number(expiryTime) - now) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setIsExpired(true);
        localStorage.removeItem("otpExpiry");
      }
    } else {
      const newExpiry = now + duration * 1000;
      localStorage.setItem("otpExpiry", newExpiry.toString());
    }
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60,
    ).padStart(2, "0")}`;

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, "");
    const otpCopy = [...userOTP];
    otpCopy[index] = val;
    setUserOTP(otpCopy);
    if (val && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !userOTP[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const otp = userOTP.join("");
    if (otp.length === otpLength && onVerify) {
      setLoading(true);
      await onVerify(otp);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 border border-gray-300 w-full max-w-md font-roboto">
        <h2 className="text-2xl font-semibold text-center mb-6 font-georgia">
          OTP Verification
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Enter the {otpLength}-digit OTP sent to <strong>{email}</strong>
        </p>
        <p className="text-center text-gray-400 mb-6">
          Time remaining: {formatTime(timeLeft)}
        </p>
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {userOTP.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                disabled={isExpired}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            ))}
          </div>
          <button
            disabled={isExpired || loading}
            onClick={handleSubmit}
            className="w-full bg-teal-900 text-white py-2 rounded hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
          <div className="text-center text-sm ">
            {resendDisabled ? (
              <p className="text-red-500">OTP limit exceeded</p>
            ) : (
              <span
                className="cursor-pointer text-blue-500"
                onClick={() => {
                  if (!resendDisabled && onResend) onResend();
                }}
              >
                Resend OTP
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
