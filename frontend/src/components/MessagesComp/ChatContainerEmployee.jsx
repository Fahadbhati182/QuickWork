import React, { useEffect, useRef, useState } from "react";
import { useMessageContext } from "../../context/MessageContext";
import { assests } from "../../assets/assests";
import { FaArrowLeft } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { RiSendPlane2Fill } from "react-icons/ri";
import axios from "axios";

const ChatContainerEmployee = () => {
  const {
    selectedUser,
    setSelectedUser,
    getWorkerMessages,
    messages,
    setMessages,
    loginUser,
  } = useMessageContext();

  const scrollEnd = useRef();

  const [input, setInput] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    try {
      setImgLoading(true);
      const { data } = await axios.post(
        `/api/message/send-worker-messages/${selectedUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setImgLoading(false);
    }
  };

  const handleSendMessage = async () => {
    console.log(selectedUser);
    try {
      if (input.trim() == "") return null;
      const { data } = await axios.post(
        `/api/message/send-worker-messages/${selectedUser._id}`,
        {
          text: input.trim(),
        }
      );
      console.log(data);
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    getWorkerMessages(selectedUser?._id);
  }, [selectedUser]);

  return selectedUser ? (
    <div
      id="tasklist"
      className="h-full overflow-hidden text-white relative overflow-y-hidden backdrop-blur-lg"
    >
      {/* Header */}
      <div className="flex  items-center gap-3 py-3 mx-4 border-b  ">
        <FaArrowLeft
          onClick={() => setSelectedUser(null)}
          src={assests?.arrow_icon}
          className=" text-white text-3xl cursor-pointer"
          alt=""
        />
        <img
          src={selectedUser.profilePic || assests.avatar_icon}
          className="w-12 h-12 rounded-full"
          alt=""
        />
        <div className="px-2 my-2 text-xl text-white flex items-center justify-start gap-2">
          <h2 className="text-white">{selectedUser?.name}</h2>
        </div>
      </div>

      {/* Chat Area */}
      <div
        id="tasklist"
        className="flex flex-col relative text-black h-[calc(100%-120px)] overflow-y-auto  p-3 pb-10"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== loginUser?._id && "flex-row-reverse"
            }`}
          >
            {msg?.image ? (
              <img
                src={msg?.image}
                className="max-w-[230px]  border-gray-700 rounded-lg overflow-hidden mb-8 "
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all  text-white  ${
                  msg.senderId === loginUser?._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div>
              <img
                src={
                  msg.senderId === loginUser?._id
                    ? loginUser?.profilePic || assests.avatar_icon
                    : selectedUser?.profilePic || assests.avatar_icon
                }
                alt=""
                className="w-7 h-7 rounded-full"
              />
              <p className="text-gray-500 text-sm">
                {formatMessageTime(msg?.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Search Bar */}
      {imgLoading && (
        <div>
          <div className="w-12 h-12 border-4 bottom-25 left-1/2  absolute border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="absolute bottom-0  left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex flex-1 bg-gray-100/12 w-full mx-10 p-3 rounded-full justify-between">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key == "Enter" ? handleSendMessage(e) : null)}
            className="flex text-sm border-none rounded-lg outline-none placeholder-gray-400"
            type="text"
            placeholder="Send a message"
          />

          <form method="POST" action="/upload" encType="multipart/form-data">
            <input
              onChange={handleImageSubmit}
              type="file"
              name="image"
              id="image"
              accept="image/png, image/jpeg"
              hidden
            />
            <label htmlFor="image">
              <GrGallery className="w-7 mr-2 cursor-pointer" alt="" />
            </label>
          </form>
        </div>
        <RiSendPlane2Fill
          onClick={handleSendMessage}
          className="text-3xl cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-[#020711] border rounded-md max-md:hidden">
      <img src={assests?.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Chat anytime,anywhere</p>
    </div>
  );
};

export default ChatContainerEmployee;
