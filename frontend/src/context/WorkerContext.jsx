import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useAppContext } from "./AppConext";
import { useMessageContext } from "./MessageContext";

const WorkerContext = createContext();

export const useWorkerContext = () => {
  return useContext(WorkerContext);
};

export const WorkerContextProvider = ({ children }) => {
  const { setUser, setIsWorker, setIsAdmin, connectSocket } = useAppContext();
  const { setLogInUser } = useMessageContext();

  const [workerTasks, setWorkerTasks] = useState([]);
  const [workerDetails, setWorkerDetails] = useState({});
  const [workerAdminDetails, setWorkerAdminDetails] = useState(null);
  const [taskCount, setTaskCount] = useState(null);

  const fetchWorkerDetails = async () => {
    try {
      const { data } = await axios.get("/api/worker/profile");
      if (data.success) {
        setWorkerDetails(data.data);
        setIsAdmin(false);
        setUser(data.data);
        setIsWorker(true);
        connectSocket(data.data, "worker");
        setLogInUser(data.data);
      }
    } catch (error) {}
  };

  const getAllWorkerTask = async () => {
    try {
      const { data } = await axios.get("/api/worker/get-all-tasks");
      if (data.success) {
        setIsWorker(true);
        setWorkerTasks(data.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchworkersAdminDetails = async () => {
    const { data } = await axios.get("/api/worker/worker-admin-detail");

    if (data.success) {
      setWorkerAdminDetails(data.data);
    }
  };

  const fetchTaskCount = async () => {
    const { data } = await axios.get("/api/worker/worker-task-count");
    if (data.success) {
      setTaskCount(data.data);
    }
  };

  useEffect(() => {
    fetchWorkerDetails();
    getAllWorkerTask();
  }, []);

  const value = {
    workerTasks,
    setWorkerTasks,
    workerDetails,
    setWorkerDetails,
    fetchWorkerDetails,
    fetchworkersAdminDetails,
    workerAdminDetails,
    fetchTaskCount,
    taskCount,
    getAllWorkerTask,
  };
  return (
    <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>
  );
};
