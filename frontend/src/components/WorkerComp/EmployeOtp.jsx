import React, { useRef } from "react";
import { useState } from "react";
import { useAppContext } from "../../context/AppConext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EmployeOtp = () => {
  const { setLoading } = useAppContext();
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = React.useState("");

  const [isEmailSend, setIsEmailSend] = useState(true);
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [isOtpVerify, setIsOtpVerify] = useState(false);

  const [otp, setOtp] = useState(Array(6).fill(""));

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/worker/reset-password", {
        email,
        newPassword: password,
        otp,
      });
      if (data.success) {
        toast.success(data.message);
        setIsOtpSend(false);
        setIsEmailSend(false);
        setIsOtpVerify(false);
        navigate("/worker/settings");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const optArray = inputRefs.current.map((e) => e.value);
    setOtp(optArray.join(""));
    setIsOtpSend(false);
    setIsEmailSend(false);
    setIsOtpVerify(true);
  };

  const sendResetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/worker/send-reset-otp", {
        email,
      });
      if (data.success) {
        toast.success(data.message);
        setIsOtpSend(true);
        setIsEmailSend(false);
        setIsOtpVerify(false);
      }
    } catch (error) {
      console.log(error);
      toast.success(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e, index) => {
    if (e.target.value > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlekeyDown = (e, index) => {
    if (e.key == "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center  bg-[#081622] overflow-hidden">
      {/* To send otp though email */}
      {isEmailSend && (
        <div className="flex flex-col gap-2 justify-center rounded-xl text-white bg-gradient-to-br from-[#2c6d8d] via-[rgb(2,49,94)] to-[#2c6d8d] p-20 rouded">
          <h1 className="text-center pb-10 ">Email to reset your Password</h1>
          <div className="flex justify-center items-center gap-10">
            <form onSubmit={sendResetOtp}>
              <div className="mb-5">
                <label className="block mb-2 font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full px-4 py-2 rounded-md border text-white border-gray-300 focus:outline-none focus:ring-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-7 py-2  mt-3 w-full rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Send OTP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* To write otp here */}
      {isOtpSend && (
        <div className="flex flex-col gap-2 justify-center rounded-xl bg-gradient-to-br from-[#2c6d8d] via-[rgb(2,49,94)] to-[#2c6d8d] p-20 rouded">
          <h1 className="text-center pb-10">OTP to reset your password</h1>
          <form onSubmit={onSubmitOtp}>
            <div
              onPaste={handlePaste}
              className="flex justify-center text-2xl items-center gap-10"
            >
              {[...Array(6)].fill(0).map((_, index) => (
                <input
                  key={index}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[index] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-16 h-16 bg-[#2d60be] text-white text-center text-3xl rounded-md"
                  required
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handlekeyDown(e, index)}
                />
              ))}
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-7 py-2  mt-3 w-full rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </form>
        </div>
      )}

      {/* To write reset password */}
      {isOtpVerify && (
        <div className="flex flex-col gap-2 justify-center rounded-xl bg-gradient-to-br from-[#2c6d8d] via-[rgb(2,49,94)] to-[#2c6d8d] p-20 rouded">
          <h1 className="text-center pb-10">Reset your Password</h1>
          <div className="flex justify-center items-center gap-10">
            <div className="mb-5">
              <form onSubmit={resetPassword}>
                <label className="block mb-2 font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Reset Password"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-7 py-2  mt-3 w-full rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeOtp;
