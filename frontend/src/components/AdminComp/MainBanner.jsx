import React, { useEffect, useState } from "react";
import Details from "./Details";
import { useAppContext } from "../../context/AppConext";
import axios from "axios";
import WelcomePage from "./WelcomePage";
import Headers from "./Headers";
import { assests } from "../../assets/assests";
import { useAdminContext } from "../../context/AdminContext";

const MainBanner = () => {
  const [datas, setDatas] = useState([]);
  const { isAdmin, setIsAdmin } = useAppContext();
  const { isProfileOpen, setIsProfileOpen } = useAdminContext();

  const getAdminBasicDetails = async () => {
    const { data } = await axios.get("/api/admin/to-get-employeData");
    if (data.success) {
      setDatas(data.data);
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    getAdminBasicDetails();
  }, []);

  if (!isAdmin) return <WelcomePage />;

  return (
    isAdmin && (
      <>
        <Headers />
        <div className={`relative ${isProfileOpen && "blur-md"} flex flex-row items-center justify-between rounded-3xl py-10 px-8 w-full overflow-hidden`}>
          {/* Decorative Blobs */}
          <div className="absolute -top-10 -left-16 w-32 h-32 bg-blue-400 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
          <div className="absolute -bottom-16 right-0 w-40 h-40 bg-blue-400 opacity-25 rounded-full blur-3xl z-0 animate-pulse" />
          {/* Banner Image */}
          <div className="flex items-center">
            <img
              src={assests.web_banner}
              className="relative z-10 w-[600px]   rounded-2xl shadow-2xl border-4 border-white/30 transition-transform duration-700 hover:scale-105 animate-fade-in mb-0"
              alt="Main Banner"
            />
          </div>
          {/* Text Content */}
          <div className="relative z-10 flex flex-col gap-7 text-left w-auto animate-slide-in">
            <p className="text-5xl font-black tracking-tight bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl transition-all duration-500">
              Orchestrate
            </p>
            <p className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl transition-all duration-500">
              Optimize
            </p>
            <p className="text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl transition-all duration-500">
              Outperform
            </p>
            <span className="mt-6 text-2xl text-white/90 font-semibold italic tracking-wide transition-all duration-500 drop-shadow-lg">
              Elevate your workflow with clarity, creativity, and control.
            </span>
          </div>
        </div>
        <div>{isAdmin && <Details datas={datas} />}</div>
        {/* Tailwind custom animations */}
        <style>
          {`
            @layer utilities {
              .animate-fade-in {
                animation: fadeIn 1.2s ease;
              }
              .animate-slide-in {
                animation: slideIn 1.2s cubic-bezier(.4,0,.2,1);
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95);}
                to { opacity: 1; transform: scale(1);}
              }
              @keyframes slideIn {
                from { opacity: 0; transform: translateY(40px);}
                to { opacity: 1; transform: translateY(0);}
              }
            }
          `}
        </style>
      </>
    )
  );
};

export default MainBanner;
