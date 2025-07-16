import React from "react";
import MessageSlideBar from "../MessagesComp/MessageSlideBar";
import ChatContainer from "../MessagesComp/ChatContainer";
import RightSlidebar from "../MessagesComp/RightSlidebar";
import { useMessageContext } from "../../context/MessageContext";
import MessageSlideBarEmploye from "../MessagesComp/MessageSlideBarEmploye";
import ChatContainerEmployee from "../MessagesComp/ChatContainerEmployee";
import RightSlidebarEmploye from "../MessagesComp/RightSlidebarEmploye";

const EmployeMessage = () => {
  const { selectedUser } = useMessageContext();

  return (
    <div className=" text-white w-full h-screen p-20">
      <div
        id="tasklist"
        className={`  ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        } backdrop-blur-xl  rounded-2xl overflow-y-hidden h-[100%] grid grid-cols-1`}
      >
        <MessageSlideBarEmploye />
        <ChatContainerEmployee />
        <RightSlidebarEmploye />
      </div>
    </div>
  );
};

export default EmployeMessage;
