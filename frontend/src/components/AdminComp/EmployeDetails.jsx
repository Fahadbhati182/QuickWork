import React, { use, useEffect } from "react";
import { PiUserFill } from "react-icons/pi";
import { FaPen } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "../../context/AdminContext";
import axios from "axios";
import toast from "react-hot-toast";

const EmployeDetails = ({ user }) => {
  const navigate = useNavigate();

  const { updateWorker, getAllWorkers } = useAdminContext();

  const deleteWorkers = async () => {
    try {
      const { data } = await axios.post("/api/admin/delete-worker", {
        workerId: user._id,
      });
      if (data.success) {
        toast.success(data.message);
        getAllWorkers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllWorkers();
  }, []);

  return (
    <div className="">
      <div className="flex flex-row border text-white p-2 items-center gap-55 transition-all duration-300 animate-fade-in">
        <div className="flex w-[300px]  items-center justify-start gap-4 transition-colors duration-300">
          <div className="bg-blue-400 p-2 rounded-full shadow-inner transition-colors duration-300 animate-pop">
            <PiUserFill className="text-3xl text-blue-600 transition-colors duration-300" />
          </div>
          <p className="text-2xl font-semibold text-white transition-colors duration-300">
            {user?.name}
          </p>
        </div>
        <div className="flex w-[500px] flex-wrap gap-2 max-w-xs transition-all duration-300">
          {user?.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-colors duration-300 animate-slide-in"
              style={{ animationDelay: `${idx * 0.1 + 0.2}s` }}
            >
              {skill}
            </span>
          ))}
        </div>
        <div>
          <span
            className={`px-4 py-1 rounded-full text-white font-bold shadow-md transition-colors duration-300 ${
              user.isActive
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : "bg-gradient-to-r from-red-400 to-red-600"
            } animate-fade-in`}
          >
            {user.isActive ? "  Active" : "Inactive"}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              updateWorker(user);
              navigate("/admin/add-workers");
            }}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-300 animate-pop"
          >
            <FaPen className="text-white text-lg transition-colors duration-300" />
          </button>
          <button
            onClick={deleteWorkers}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-300 animate-pop"
          >
            <RxCross2 className="text-white text-lg transition-colors duration-300" />
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease;
          }
          @keyframes pop {
            0% { transform: scale(0.8);}
            80% { transform: scale(1.05);}
            100% { transform: scale(1);}
          }
          .animate-pop {
            animation: pop 0.4s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes slide-in {
            from { opacity: 0; transform: translateX(-30px);}
            to { opacity: 1; transform: translateX(0);}
          }
          .animate-slide-in {
            animation: slide-in 0.5s cubic-bezier(.68,-0.55,.27,1.55) both;
          }
        `}
      </style>
    </div>
  );
};

export default EmployeDetails;
