import React from "react";
import SlideBar from "../AdminComp/SlideBar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="h-screen bg-[#020711] w-full flex  gap-5 overflow-x-hidden text-white">
      <SlideBar />
      <div className="flex-1 flex flex-col gap-6 overflow-y-hidden p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;

