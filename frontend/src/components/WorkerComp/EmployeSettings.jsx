import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppConext";
import { useWorkerContext } from "../../context/WorkerContext";
import axios from "axios";
import toast from "react-hot-toast";

const EmployeSettings = () => {
  const { isWorker, navigate, setLoading } = useAppContext();
  const { workerDetails, fetchWorkerDetails } = useWorkerContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/worker/update-profile", {
        name,
        email,
      });
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        fetchWorkerDetails();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toSendVerifyOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/worker/send-verify-otp");
      if (data.success) {
        toast.success(data.message);

        navigate("/worker/send-verify-otp");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workerDetails) {
      setName(workerDetails?.name || "");
      setEmail(workerDetails?.email || "");
    }
  }, [workerDetails]);

  useEffect(() => {
    fetchWorkerDetails();
  }, []);

  return (
    isWorker && (
      <div className="p-10 m-10 w-full bg-gradient-to-br from-[#011929] via-[rgb(3,67,119)] to-[#000f1a] rounded-xl shadow-lg max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl flex flex-col">
        <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold text-white text-center">
          Employe Settings
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:gap-6 w-full"
        >
          <div className="mb-4 sm:mb-5 mt-6 sm:mt-10 flex flex-col">
            <label className="block mb-1 sm:mb-2 font-medium text-white ">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full px-3 sm:px-4 py-2 rounded-md border text-white border-gray-300 focus:outline-none focus:ring-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4 sm:mb-5 flex flex-col">
            <label className="block mb-1 sm:mb-2 font-medium text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-3 sm:px-4 py-2 rounded-md border text-white border-gray-300 focus:outline-none focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!workerDetails?.isAccountVerify && (
              <p
                onClick={toSendVerifyOtp}
                className="text-red-500 text-sm mt-2 cursor-pointer"
              >
                Click to send verify email otp
              </p>
            )}
          </div>
          <div className="mb-2 sm:mb-3 text-sm text-white">
            Send OTP to reset password{" "}
            <NavLink
              to={"/worker/send-reset-otp"}
              className="text-blue-600 underline hover:text-blue-800"
            >
              this
            </NavLink>{" "}
          </div>
          <button
            type="submit"
            className="w-1/3  bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    )
  );
};

export default EmployeSettings;
