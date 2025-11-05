import React, { useState } from "react";
import { NavLink, useLocation, useParams } from "react-router";
import { ImHome } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import { PiYoutubeLogoFill } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import { useAppContext } from "../../context/AppConext";
import { LuMessageSquareMore } from "react-icons/lu";;
import { assests } from "../../assets/assests";

const SlideBar = () => {
  const { isAdmin } = useAppContext();
  const { pathname } = useLocation();

  const [selected, setSelected] = useState(pathname.toString());

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div
        className="hidden md:flex h-full flex-col w-60 bg-[#001120] p-6 shadow-2xl 
        max-md:w-20 max-md:p-2 transition-all duration-300"
      >
        <NavLink to="/" className="flex items-center justify-center mb-8">
          <img
            src={assests.logo}
            className="w-24 h-24 object-contain rounded-full  shadow-lg border-1 border-blue-500 bg-white max-md:w-10 max-md:h-10"
            alt="logo-png"
          />
        </NavLink>

        <ul className="flex flex-col gap-6 flex-1 mt-4">
          {[
            { to: "/admin", icon: <ImHome />, label: "Dashboard" },
            {
              to: "/admin/admin-workers",
              icon: <FaUser />,
              label: "Employees",
            },
            {
              to: "/admin/admin-tasks",
              icon: <PiYoutubeLogoFill />,
              label: "Tasks",
            },
            {
              to: "/admin/settings",
              icon: <IoIosSettings />,
              label: "Settings",
            },
            {
              to: "/admin/messages",
              icon: <LuMessageSquareMore />,
              label: "Messages",
            },
          ].map(({ to, icon, label }) => (
            <li key={label}>
              <NavLink
                to={to}
                onClick={() => setSelected(to)}
                className={`flex items-center gap-4 py-4 pl-4 rounded-md transition-all duration-200 group
                  ${
                    selected == to
                      ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg "
                      : "text-gray-300 hover:bg-blue-500/80 hover:text-white "
                  }
                  `}
                aria-current="page"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform duration-200">
                  {icon}
                </span>
                <span className="text-lg font-semibold  tracking-wide">
                  {label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
        <hr className="border-blue-700 mt-8" />
      </div>
    </div>
  );
};

export default SlideBar;
