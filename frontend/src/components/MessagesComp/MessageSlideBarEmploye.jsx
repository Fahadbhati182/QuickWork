import React, { useEffect, useState } from "react";
import { useMessageContext } from "../../context/MessageContext";
import { assests } from "../../assets/assests";
import { FaSearch } from "react-icons/fa";

const MessageSlideBarEmploye = () => {
  const {
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    usersForSlidebar,
    getAdminForWorker,
  } = useMessageContext();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminForWorker();
  }, []);

  return (
    <div
      className={`bg-[#001221] h-full p-5 w-full rounded-r-xl overflow-y-hidden text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
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
        <div>
          <div
            onClick={() => {
              setSelectedUser(usersForSlidebar);
              setUnseenMessages((prev) => ({
                ...prev,
                [usersForSlidebar._id]: 0,
              }));
            }}
            className={`border  border-gray-500/100 mt-2 relative flex items-center gap-2 p-2 pl-4  rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id == usersForSlidebar._id && "bg-[#282142]/50"
            }`}
          >
            <img
              src={usersForSlidebar?.profilePic || assests.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5 pt-3">
              <p className="text-white text-sm ">{usersForSlidebar.name}</p>
            </div>
            {unseenMessages[usersForSlidebar._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 text-white">
                {unseenMessages[usersForSlidebar._id]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSlideBarEmploye;
