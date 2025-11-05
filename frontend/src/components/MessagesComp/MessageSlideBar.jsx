import React, { useEffect, useState } from "react";
import { useMessageContext } from "../../context/MessageContext";
import { assests } from "../../assets/assests";
import { HiOutlineMenu } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useAppContext } from "../../context/AppConext";
const MessageSlideBar = () => {
  const {
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getWorkersForSlider,
    getAdminMessages,
    usersForSlidebar,
  } = useMessageContext();

  const { onlineWorkers } = useAppContext();

  const [search, setSearch] = useState("");

  const filterUser =
    search.length > 0
      ? usersForSlidebar.filter((user) =>
          user?.fullName.toLowerCase().includes(search.toLocaleLowerCase())
        )
      : usersForSlidebar;

  useEffect(() => {
    getWorkersForSlider();
  }, []);

  return (
    <div
      className={`bg-[#001221] h-full p-5 w-full rounded-r-xl overflow-y-hidden text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        {/* <div className="flex justify-between item-center">
          <div className="relative py-2 group">{}</div>
        </div> */}
        {/* serach bar */}
        <div className="flex relative justify-start items-center  mt-5">
          <FaSearch className="text-2xl text-white absolute ml-3" />
          <div className="flex items-center border pl-6 gap-2  h-12 rounded-full shadow-sm w-[800px]  ">
            <input
              type="text"
              placeholder="Search user"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-white outline-none text-sm pl-5 bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* user */}
      <div className="flex flex-col">
        <div
          onClick={() => {
            getAdminMessages(selectedUser?._id);
          }}
        >
          {filterUser.map((user, index) => (
            <div
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              key={index}
              className={`border  border-gray-500/100 mt-2 relative flex items-center gap-2 p-2 pl-4  rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id == user._id && "bg-[#282142]/50"
              }`}
            >
              <img
                src={user?.profilePic || assests.avatar_icon}
                alt=""
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p className="text-white text-sm ">{user.name}</p>
                {onlineWorkers?.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">Offline</span>
                )}
              </div>
              {unseenMessages[user._id] > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 text-white">
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageSlideBar;
