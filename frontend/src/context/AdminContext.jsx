import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useAppContext } from "./AppConext";
import toast from "react-hot-toast";
import { useMessageContext } from "./MessageContext";

const AdminContext = createContext();

export const useAdminContext = () => {
  return useContext(AdminContext);
};

export const AdminContextProvider = ({ children }) => {
  const {
    setUser,
    setIsWorker,
    setIsAdmin,
    user,
    isAdmin,
    connectSocket,
    setLoading,
  } = useAppContext();
  const { setLogInUser } = useMessageContext();

  const [adminDetails, setAdminDetails] = useState({});
  const [adminTasks, setAdminTasks] = useState([]);
  const [adminWorkers, setAdminWorkers] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false); //for profilfe pic

  const [isUpdateWorker, setIsUpdateWorker] = useState(false);
  const [updateWorkerData, setUpdateWorkerData] = useState({});

  const fetchAdminDetails = async () => {
    try {
      const { data } = await axios.get("/api/admin/profile");
      //  console.log(data);
      if (data.success) {
        setAdminDetails(data.data);
        setUser("admin");
        setIsWorker(false);
        setIsAdmin(true);
        connectSocket(data.data, "admin");
        setLogInUser(data.data);
      }
    } catch (error) {}
  };

  const isAdminAuthenticated = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin");
      // console.log(data);
      if (data.success) {
        setUser("admin");
        setIsWorker(false);
        setIsAdmin(true);
      }
    } catch (error) {}
  };

  const getAllWorkers = async () => {
    try {
      const { data } = await axios.get("/api/admin/getAllWorker");
      if (data.success) {
        setAdminWorkers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTasks = async () => {
    try {
      const { data } = await axios.get("/api/admin/getAllTasks");
      if (data.success) {
        setAdminTasks(data.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateWorker = (user) => {
    setIsUpdateWorker(true);
    setUpdateWorkerData(user);
  };

  useEffect(() => {
    fetchAdminDetails();
    isAdminAuthenticated();
  }, [setIsAdmin, user, isAdmin]);

  const value = {
    adminDetails,
    setAdminDetails,
    adminTasks,
    setAdminTasks,
    adminWorkers,
    updateWorker,
    isUpdateWorker,
    setIsUpdateWorker,
    updateWorkerData,
    setUpdateWorkerData,
    isAdminAuthenticated,
    fetchAdminDetails,
    getAllWorkers,
    getAllTasks,
    isProfileOpen,
    setIsProfileOpen,
  };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
