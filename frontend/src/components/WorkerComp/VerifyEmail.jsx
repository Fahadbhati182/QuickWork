import React from "react";
import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppConext";
import { useEffect } from "react";

const VerifyEmail = () => {
  const { setLoading, navigate } = useAppContext();

  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));

  const onSubmitOtp = async (e) => {
     e.preventDefault();
    try {
      setLoading(true);
      console.log(otp);
      const { data } = await axios.post("/api/worker/verify-email", { otp });
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        navigate("/worker/settings");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const optArray = inputRefs.current.map((e) => e.value);
    setOtp(optArray.join(""));
  }, [otp]);

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

    console.log(e.clipboardData);
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  return (
    <div className="flex w-full justify-center items-center ">
      <div className="flex flex-col gap-2 justify-center rounded-xl bg-gradient-to-br from-[#2c6d8d] via-[rgb(2,49,94)] to-[#2c6d8d] p-20 rouded">
        <h1 className="text-center pb-10 text-white">
          OTP to reset your password
        </h1>
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
    </div>
  );
};

export default VerifyEmail;
