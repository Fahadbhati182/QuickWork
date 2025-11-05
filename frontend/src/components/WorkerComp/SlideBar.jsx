import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ImHome } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import { PiYoutubeLogoFill } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import { HiStatusOnline } from "react-icons/hi";
import { MdTask } from "react-icons/md";
import axios from "axios";
import { useWorkerContext } from "../../context/WorkerContext";
import { useAppContext } from "../../context/AppConext";
import { assests } from "../../assets/assests";
import { LuMessageSquareMore } from "react-icons/lu";

const SlideBar = () => {
  const { fetchWorkerDetails } = useWorkerContext();

  const { isWorker } = useAppContext();
  const { pathname } = useLocation();

  const [selected, setSelected] = useState(pathname.toString());

  useEffect(() => {
    fetchWorkerDetails();
  }, []);
  return (
    isWorker && (
      <div className=" flex h-screen ">
        <aside className="flex h-full flex-col w-60 bg-[#001120] p-6 shadow-lg">
          <NavLink to="/" className="flex items-center justify-center ">
            <img
              src={assests.logo}
              className="w-full h-full  object-contain"
              alt="logo-png"
            />
          </NavLink>

          <ul className="flex flex-col gap-6 flex-1">
            {[
              { to: "/worker", icon: <ImHome />, label: "Dashboard" },
              { to: "/worker/tasks", icon: <MdTask />, label: "Tasks" },
              {
                to: "/worker/status",
                icon: <HiStatusOnline />,
                label: "Status",
              },
              {
                to: "/worker/settings",
                icon: <IoIosSettings />,
                label: "Settings",
              },
              {
                to: "/worker/messages",
                icon: <LuMessageSquareMore />,
                label: "Messages",
              },
            ].map(({ to, icon, label }) => (
              <li key={label}>
                <NavLink
                  onClick={() => setSelected(to)}
                  to={to}
                  className={`flex items-center gap-4 py-4 pl-4 rounded-lg transition-all duration-200 group
                  ${
                    to == selected
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:bg-blue-500 hover:text-white"
                  }`}
                  aria-current="page"
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-lg font-medium">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <hr className="border-gray-700 mt-8" />
        </aside>
      </div>
    )
  );
};

export default SlideBar;
