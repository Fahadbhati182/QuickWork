import React, { useState } from "react";
import { useAdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { useAppContext } from "../../context/AppConext";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const Setting = () => {
  const { isAdmin, setLoading } = useAppContext();
  const { adminDetails, fetchAdminDetails } = useAdminContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/change-adminDetails", {
        name,
        email,
      });
      if (data.success) {
        toast.success(data.message);
        fetchAdminDetails();
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
      fetchAdminDetails();
    }
  };

  useEffect(() => {
    if (adminDetails) {
      setName(adminDetails?.name);
      setEmail(adminDetails?.email);
    }
  }, [adminDetails]);

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    isAdmin && (
      <div className="mr-8 sm:mx-6 md:mx-10 mt-10 md:mt-20 mb-10 md:mb-30 h-full p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#011929] via-[rgb(3,67,119)] to-[#000f1a] rounded-xl shadow-lg max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl flex flex-col">
        <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold text-gray-800 text-center">
          Admin Settings
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 w-full">
          <div className="mb-4 sm:mb-5 mt-6 sm:mt-10 flex flex-col">
            <label className="block mb-1 sm:mb-2 font-medium text-white">Name</label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full px-3 sm:px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2"
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
              className="w-full px-3 sm:px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2 sm:mb-3 text-sm">
            Send OTP to reset password{" "}
            <NavLink to={"/admin/send-reset-otp"} className="text-blue-600 underline hover:text-blue-800">this</NavLink>{" "}
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-5 sm:px-7 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    )
  );
};

export default Setting;
