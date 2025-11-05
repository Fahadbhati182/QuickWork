import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppConext";
import { assests } from "../../assets/assests";
import { useWorkerContext } from "../../context/WorkerContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Details from "./Details";

const EmployeBanner = () => {
  const { isWorker, setIsWorker, navigate } = useAppContext();
  const {
    workerDetails,
    setWorkerDetails,
    fetchTaskCount,
    taskCount,
    fetchWorkerDetails,
  } = useWorkerContext();

  const [showDropdown, setShowDropdown] = useState();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/worker/logout");
      if (data.success) {
        toast.success(data.message);
        setWorkerDetails(null);
        setIsWorker(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchWorkerDetails();
    fetchTaskCount();
  }, []);

  return (
    isWorker && (
      <div className="p-20 w-full  rounded-3xl shadow-xl text-white  items-center">
        {/* Header */}
        <div className="flex items-center justify-between ">
          <h1 className="text-5xl  font-extrabold mb-8 text-blue-900 ">
            Employee Dashboard
            <p
              onClick={() => navigate("/worker/settings")}
              className="text-sm  w-1/2  mt-1 text-red-500 cursor-pointer mb-2"
            >
              {!workerDetails?.isAccountVerify && (
                <span>Verify your Account</span>
              )}
            </p>
          </h1>
          <div className="relative flex">
            <img
              onClick={() => setShowDropdown((prev) => !prev)}
              src={workerDetails?.profilePic ? workerDetails?.profilePic : assests.avatar_icon}
              alt="User Icon"
              className="w-12 cursor-pointer h-12 rounded-full   shadow-md"
            />
            {showDropdown && (
              <div className="absolute right-2 mt-15 w-30 bg-[#31312f] rounded shadow-lg z-10">
                {!isWorker ? (
                  <button
                    className="block  text-left text-xl px-4 py-1 "
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>
                ) : (
                  <button
                    className="block  text-left px-4 py-1 "
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center w-full gap-20 mt-10">
          {/* Image */}
          <div>
            <img
              className="w-full object-cover rounded-2xl shadow-2xl "
              src={assests.workerBanner}
              alt="worker-banner"
            />
          </div>
          {/* Content */}
          <div className="ml-16">
            <div className="mt-12 flex flex-col items-center animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-wide">
                Welcome,{" "}
                <span className="text-blue-500">{workerDetails?.name}</span>
              </h1>
              <p className="text-lg text-gray-500 mb-8">
                Your personalized dashboard
              </p>
              <div className="flex flex-col flex-wrap gap-10">
                <Details datas={taskCount} isSelected={"No"} flexWrap={"Yes"} />
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
      }
      .animate-fade-in {
        animation: fade-in 1s ease;
      }
      `}
        </style>
      </div>
    )
  );
};

// bg-gradient-to-tr from-blue-400 to-blue-600
// bg-gradient-to-tr from-green-400 to-green-600
// bg-gradient-to-tr from-yellow-400 to-yellow-600
export default EmployeBanner;
