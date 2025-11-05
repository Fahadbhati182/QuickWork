import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppConext";
import SlideBar from "../WorkerComp/SlideBar";
import { Outlet, useNavigate } from "react-router-dom";

const EmployeDashboard = () => {
  return (
    <div className=" w-full h-screen bg-[#020711]  overflow-y-hidden">
      <div className=" flex text-2xl">
        <SlideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeDashboard;
