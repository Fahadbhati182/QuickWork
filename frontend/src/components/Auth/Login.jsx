import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";
import { LuMail } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import Loading from "../Others/Loading";
import axios from "axios";
import { useAppContext } from "../../context/AppConext";
import { useWorkerContext } from "../../context/WorkerContext";
import { useAdminContext } from "../../context/AdminContext";
import { assests } from "../../assets/assests";
import { useMessageContext } from "../../context/MessageContext";

const Login = () => {
  const navigate = useNavigate();

  const { setLogInUser } = useMessageContext();
  const { loading, setLoading, setUser, setIsWorker, isAdmin, setIsAdmin } =
    useAppContext();
  const { fetchWorkerDetails } = useWorkerContext();
  const { isAdminAuthenticated, fetchAdminDetails } = useAdminContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/${role}/login`, {
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message);
        setUser(data.data);
        setLogInUser(data.data);
        setRole("");
        setEmail("");
        setPassword("");
        if (role == "worker") {
          navigate("/worker");
          setIsWorker(true);
          fetchWorkerDetails();
          setIsAdmin(false);
        } else {
          navigate("/admin");
          isAdminAuthenticated();
          fetchAdminDetails();
          setIsAdmin(true);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (choosenName) => {
    setRole((prev) => (prev == choosenName ? null : choosenName));
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="flex flex-col md:flex-row p-4 md:p-10 bg-[#000F19] w-screen h-screen overflow-auto ">
        <div className="w-full md:w-1/2  md:flex items-center justify-center">
          <img
            src={assests.login}
            alt="Login"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <form
            onSubmit={submitHandler}
            className="w-full max-w-xs md:max-w-md flex flex-col items-center justify-center"
          >
            <h1 className="text-3xl hidden md:text-4xl text-blue-500 font-medium">
              Login in
            </h1>
            <p className="text-2xl md:text-xl  text-blue-500 mt-3">
              Welcome back!
            </p>

            <div className="flex items-center gap-2 md:gap-4 w-full mb-2 md:my-5">
              <div className="w-full h-px bg-gray-300/90"></div>
              <p className="w-full text-nowrap text-xs md:text-sm text-blue-500 text-center">
                Please sign in to continue
              </p>
              <div className="w-full h-px bg-gray-300/90"></div>
            </div>

            <div className="flex items-center w-full bg-transparent border text-blue-500 h-11 md:h-12 rounded-full overflow-hidden pl-4 md:pl-6 gap-2">
              <LuMail />
              <input
                type="email"
                placeholder="Email id"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-transparent text-blue-500 placeholder-blue-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="flex items-center mt-4 md:mt-6 w-full bg-transparent border text-blue-500 border-gray-300/60 h-11 md:h-12 rounded-full overflow-hidden pl-4 md:pl-6 gap-2">
              <FaLock />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="bg-transparent text-blue-500 placeholder-blue-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="w-full flex flex-col items-start mt-8 md:mt-10 text-blue-500">
              <p className="text-base md:text-lg text-blue-500 ">
                Select your Role in QuickWork
              </p>
              <div className="flex flex-col items-start gap-2">
                <label className="text-lg md:text-2xl">Role</label>
                <div className="flex gap-3 md:gap-5 justify-center items-center mt-1">
                  <div className="flex gap-2 text-base md:text-xl">
                    <input
                      checked={role === "admin"}
                      onChange={() => handleCheckboxChange("admin")}
                      type="checkbox"
                      name="admin"
                      value="admin"
                    />
                    <label>Admin</label>
                  </div>
                  <div className="flex gap-2 text-base md:text-xl">
                    <input
                      checked={role === "worker"}
                      onChange={() => handleCheckboxChange("worker")}
                      type="checkbox"
                      name="worker"
                      value="worker"
                    />
                    <label>Worker</label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 md:h-11 rounded-full text-white bg-blue-500 mt-4 md:mt-5 hover:opacity-90 transition-opacity"
            >
              Login
            </button>
            <p className="text-gray-500/90 text-xs md:text-sm mt-3 md:mt-4">
              Don’t have an account?{" "}
              <NavLink
                className="text-indigo-400 hover:underline"
                to={"/signup"}
              >
                Sign up
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
