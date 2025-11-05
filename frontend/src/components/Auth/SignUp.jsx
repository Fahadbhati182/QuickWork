import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoMailSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppConext";
import Loading from "../Others/Loading";
import { useAdminContext } from "../../context/AdminContext";
import { assests } from "../../assets/assests";

const SignUp = () => {
  const navigate = useNavigate();

  const { loading, setLoading } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAdminAuthenticated, fetchAdminDetails } = useAdminContext();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/create", {
        name,
        email,
        password,
      });
      if (data.success) {
        toast.success(data.message);
        setName("");
        setEmail("");
        setPassword("");
        isAdminAuthenticated();
        fetchAdminDetails();
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="flex flex-col md:flex-row p-4 md:p-10 bg-[#03121E] text-white w-screen h-screen overflow-auto">
        <div className="w-full md:w-1/2  md:flex">
          <img src={assests.signup} className="w-full h-full object-cover" alt="" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <form
            onSubmit={submitHandler}
            className="w-full max-w-xs md:max-w-md flex flex-col items-center justify-center mx-auto"
          >
            <h2 className="text-3xl md:text-4xl text-blue-500 font-medium mb-2">Sign Up</h2>
            <h1 className="text-base md:text-lg text-blue-500">Welcome Admin</h1>
            <div className="flex items-center gap-2 md:gap-4 w-full my-4 md:my-5">
              <div className="w-full h-px bg-gray-300/90"></div>
              <p className="w-full text-nowrap text-sm md:text-xl text-gray-500/90 text-center">
                Please Sign in to continue
              </p>
              <div className="w-full h-px bg-gray-300/90"></div>
            </div>
            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-4 md:pl-6 gap-2 mb-4">
              <FaUser />
              <input
                type="name"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-4 md:pl-6 gap-2">
              <IoMailSharp />
              <input
                type="email"
                placeholder="Email id"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="flex items-center mt-4 md:mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-4 md:pl-6 gap-2">
              <FaLock />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-full text-white bg-blue-500 mt-4 md:mt-5 hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
            <p className="text-gray-500/90 text-xs md:text-sm mt-3 md:mt-4 text-center">
              Already have an account?{" "}
              <NavLink
                className="text-indigo-400 hover:underline"
                to={"/login"}
              >
                login
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
