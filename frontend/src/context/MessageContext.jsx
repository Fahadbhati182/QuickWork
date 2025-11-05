import React from "react";
import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useAppContext } from "./AppConext";

const MessageContext = createContext();

export const MessageContextProvider = ({ children }) => {
  const messagsArr = [
    {
      senderId: "123456789987654321",
      receiverId: "789456123321654987",
      text: "Hello Girl, How are you",
      image: "/welcomePage.png",
      seen: false,
      createdAt: "07/08",
    },
    {
      senderId: "123456789987654321",
      receiverId: "789456123321654987",
      text: "Hello Girl, How are you",
      image: "/welcomePage.png",
      seen: false,
      createdAt: "07/08",
    },
    {
      senderId: "123456789987654321",
      receiverId: "789456123321654987",
      text: "Hello Girl, How are you",
      image: "/welcomePage.png",
      seen: false,
      createdAt: "07/08",
    },
    {
      senderId: "123456789987654321",
      receiverId: "789456123321654987",
      text: "Hello Girl, How are you",
      // image: "./todelete.png",
      seen: false,
      createdAt: "08/07",
    },
  ];

  const { socket, connectSocket } = useAppContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [loginUser, setLogInUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [messages, setMessages] = useState([]);
  const [usersForSlidebar, setUsersForSlidebar] = useState([]);

  const getWorkersForSlider = async () => {
    const { data } = await axios.post("/api/message/get-all-workers");
    if (data.success) {
      setUsersForSlidebar(data.data.workers);
      setUnseenMessages(data?.data.unseenMessages);
    }
  };

  const getAdminMessages = async (selectedId) => {
    try {
      const { data } = await axios.post(
        `/api/message/get-admin-messages/${selectedId}`
      );
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeToUser = async () => {
    if (!socket) return;

    socket.on("newMessage", async (newMessage) => {
      if (selectedUser && newMessage.senderId == selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        await axios.put(`/api/message/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((preUnseenMessage) => ({
          ...preUnseenMessage,
          [newMessage.senderId]: preUnseenMessage[newMessage.senderId]
            ? preUnseenMessage[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unSubscribeToUser = async () => {
    if (socket) socket.off("newMessage");
  };

  const getAdminForWorker = async () => {
    const { data } = await axios.post(`/api/message/get-admin`);
    if (data.success) {
      setUsersForSlidebar(data.data.admin);
      setUnseenMessages(data?.data.unseenMessages);
    }
  };

  const getWorkerMessages = async (selectedId) => {
    try {
      const { data } = await axios.post(
        `/api/message/get-worker-messages/${selectedId}`
      );
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    subscribeToUser();

    return () => unSubscribeToUser();
  }, [socket, selectedUser]);

  

  useEffect(() => {
    if (loginUser) {
      connectSocket(loginUser, loginUser.role);
    }
  }, []);

  const value = {
    getWorkerMessages,
    getAdminForWorker,
    usersForSlidebar,
    getAdminMessages,
    getWorkersForSlider,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    messages,
    setMessages,
    loginUser,
    setLogInUser,
  };
  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  return useContext(MessageContext);
};
