import React, { useState } from "react";
import MessageSlideBar from "../MessagesComp/MessageSlideBar";
import ChatContainer from "../MessagesComp/ChatContainer";
import RightSlidebar from "../MessagesComp/RightSlidebar";
import { useMessageContext } from "../../context/MessageContext";

const AdminMessages = () => {
  const { selectedUser } = useMessageContext();
  return (
    <div className=" text-white w-full h-screen p-5">
      <div
        className={`  ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        } backdrop-blur-xl  rounded-2xl overflow-hidden h-[100%] grid grid-cols-1`}
      >
        <MessageSlideBar />
        <ChatContainer />
        <RightSlidebar />
      </div>
    </div>
  );
};

export default AdminMessages;
