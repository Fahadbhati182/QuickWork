import React, { useEffect, useState } from "react";
import { assests } from "../../assets/assests";
import { useMessageContext } from "../../context/MessageContext";

const RightSlidebarEmploye = () => {
  const { selectedUser, messages } = useMessageContext();
  const [msgImages, setMsgImage] = useState([]);

  useEffect(() => {
    setMsgImage(
      messages.filter((message) => message.image).map((msg) => msg.image)
    );
  }, [selectedUser, messages]);

  return (
    selectedUser && (
      <div
        className={`bg-[#001221] text-white w-full relative overflow-y-hidden ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            className="w-20 aspect-[1/1] rounded-full"
            src={selectedUser?.profilePic || assests.avatar_icon}
            alt=""
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {selectedUser.name}
          </h1>
          <p>{selectedUser.bio}</p>
        </div>
        <hr className="border-[#ffffff50] my-4" />
        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 grid grid-cols-2 gap-3 opacity-80 overflow-y-hidden">
            {msgImages.map((url, index) => (
              <div
                className="cursor-pointer rounded"
                key={index}
                onClick={() => window.open(url)}
              >
                <img src={url} alt="" className="h-full  rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default RightSlidebarEmploye;
