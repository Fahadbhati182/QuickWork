import React from "react";
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = BACKEND_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWorker, setIsWorker] = useState(false);

  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineWorkers, setOnlineWorkers] = useState([]);

  const connectSocket = (userData, role) => {
    const newSocket = io(BACKEND_URL, {
      query: {
        userId: userData._id,
        role: role,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("newTask", (newTask) => {
      console.log(newTask);
      toast.success("Admin has assigned a New Task");
    });

    newSocket.on("getOnlineWorkers", (workerId) => {
      setOnlineWorkers(workerId);
    });
  };


  
  const value = {
    socket,
    navigate,
    loading,
    setLoading,
    error,
    setError,
    user,
    setUser,
    isWorker,
    setIsWorker,
    isAdmin,
    setIsAdmin,
    connectSocket,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
