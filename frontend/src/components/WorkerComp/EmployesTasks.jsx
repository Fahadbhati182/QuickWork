import React, { useEffect, useState } from "react";
import Details from "./Details";
import { assests } from "../../assets/assests";
import { useWorkerContext } from "../../context/WorkerContext";
import { FaSearch } from "react-icons/fa";
import IndividualTask from "./IndividualTask";
import { IoMdArrowDropleft } from "react-icons/io";
import axios from "axios";

const EmployesTasks = () => {
  const {
    workerTasks,
    workerDetails,
    getAllWorkerTask,
    fetchTaskCount,
    taskCount,
  } = useWorkerContext();

  const [search, setSearch] = useState("");
  const [filteredTask, setFilteredTask] = useState([]);
  const [isOpenTaskDetail, setIsOpenTaskDetaisl] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [toShow, setToShow] = useState("");

  const markTaskAsFailed = async (id) => {
    const { data } = await axios.post(`/api/worker/mark-failed/${id}`);
    if (data.success) {
      fetchTaskCount();
      getAllWorkerTask();
      setIsOpenTaskDetaisl(false);
      fetchTaskCount();
    }
  };

  const markTaskAsCompleted = async (id) => {
    const { data } = await axios.post(`/api/worker/mark-completed/${id}`);
    if (data.success) {
      fetchTaskCount();
      getAllWorkerTask();
      setIsOpenTaskDetaisl(false);
      fetchTaskCount();
    }
  };

  const markTaskAsActive = async (id) => {
    const { data } = await axios.post(`/api/worker/mark-active/${id}`);
    if (data.success) {
      fetchTaskCount();
      getAllWorkerTask();
      setIsOpenTaskDetaisl(false);
      fetchTaskCount();
    }
  };

  useEffect(() => {
    if (toShow) {
      setFilteredTask(
        workerTasks.filter(
          (task) => task.status == toShow.toLowerCase().split(" ")[0]
        )
      );
    }
  }, [toShow]);

  useEffect(() => {
    if (search.length > 0) {
      const filtered = workerTasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTask(filtered);
    }
  
  }, [search]);

  useEffect(() => {
    getAllWorkerTask();
    fetchTaskCount();
  }, []);

  return (
    <div className="p-10 relative w-screen h-full overflow-hidden text-white">
      <div
        className={`w-full ${
          isOpenTaskDetail ? "blur-xl" : ""
        } mx-auto rounded-2xl shadow-lg p-2`}
      >
        {/* Header */}
        <div className="flex gap-40 items-center ">
          <div className="flex flex-col mb-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Employee Tasks
            </h1>
            <p className="text-gray-500">
              Overview of your current tasks and progress
            </p>
          </div>
          {/* search bar */}
          <div className="flex flex-col sm:flex-row justify-start items-stretch sm:items-center  gap-3">
            <div className="flex items-center border pl-3 gap-2 h-10 sm:h-12 rounded-full shadow-sm w-full max-w-full sm:w-[400px] md:w-[600px] lg:w-[800px] bg-transparent">
              <FaSearch className="text-2xl sm:text-3xl text-white mr-2" />
              <input
                type="text"
                placeholder="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full text-white outline-none text-base sm:text-xl bg-transparent"
              />
            </div>
          </div>
        </div>
        {/* Boxes of information */}
        <div className="rounded-xl shadow-inner mb-8 cursor-pointer">
          <Details
            setToShow={setToShow}
            datas={taskCount}
            isSelected={"Yes"}
            flexWrap={"No"}
          />
        </div>

        {/* Task details */}
        <div className="">
          {search.length > 0 || toShow ? (
            <div
              id="tasklist"
              className="bg-[#121926] flex py-3 gap-3 mx-5  text-white rounded-md overflow-x-auto"
            >
              {filteredTask.map((task, idx) => (
                <>
                  <IndividualTask
                    key={idx}
                    task={task}
                    isOpenTaskDetail={isOpenTaskDetail}
                    setIsOpenTaskDetaisl={setIsOpenTaskDetaisl}
                    setSelectedTask={setSelectedTask}
                  />
                </>
              ))}
            </div>
          ) : (
            <div
              id="tasklist"
              className="bg-[#121926] flex py-3 gap-3 mx-3  text-white rounded-md overflow-x-auto"
            >
              {workerTasks.map((task, idx) => (
                <>
                  <IndividualTask
                    key={idx}
                    task={task}
                    isOpenTaskDetail={isOpenTaskDetail}
                    setIsOpenTaskDetaisl={setIsOpenTaskDetaisl}
                    setSelectedTask={setSelectedTask}
                  />
                </>
              ))}
            </div>
          )}
        </div>
      </div>
      {isOpenTaskDetail && (
        <div className="bg-[#000F19] text-black absolute flex rounded-xl inset-0 left-80 top-40 justify-center items-center w-[900px]  h-[600px]">
          <>
            <IoMdArrowDropleft
              onClick={() => setIsOpenTaskDetaisl(false)}
              className="text-5xl cursor-pointer self-start mt-3 text-white"
            />
            <div
              className={` ${
                selectedTask?.status === "active"
                  ? "bg-[#E2A000]"
                  : selectedTask?.status === "completed"
                  ? "bg-[#00B64D]"
                  : selectedTask?.status === "failed"
                  ? "bg-[#b24448]"
                  : "bg-[#2472FF]"
              } p-10  rounded-3xl    transition-transform hover:scale-[1.03] duration-300`}
            >
              <div className=" shadow-md rounded-lg p-5 mb-4 border hover:shadow-lg transition duration-200">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-black">
                    {selectedTask.title}
                  </h2>
                  <span
                    className={`text-sm px-3 py-1 ${
                      selectedTask?.status === "active"
                        ? "bg-[#7f6322]"
                        : selectedTask?.status === "completed"
                        ? "bg-[#1c7140]"
                        : selectedTask?.status === "failed"
                        ? "bg-[#992f32]"
                        : "bg-[#26519f]"
                    } rounded-full font-medium  "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedTask.status}
                  </span>
                </div>

                <p className="text-black mb-5">{selectedTask.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <span className="font-extrabold text-black">
                      Assigned To:
                    </span>{" "}
                    {selectedTask.assignedTo}
                  </div>
                  <div>
                    <span className="font-extrabold text-black">Deadline:</span>{" "}
                    {selectedTask.deadLine}
                  </div>
                  <div>
                    <span className="font-extrabold text-black">Payment:</span>{" "}
                    â‚¹{selectedTask.payment}
                  </div>
                  <div>
                    <span className="font-extrabold text-black">Status: </span>
                    {selectedTask.status}
                  </div>
                </div>
              </div>
              <div className="flex justify-center rounded-lg">
                {selectedTask?.status === "newtask" && (
                  <button
                    onClick={() => markTaskAsActive(selectedTask._id)}
                    className={` w-1/2  bg-[#E2A000] p-2 rounded-xl `}
                  >
                    {selectedTask?.status === "newtask" ? "Make Active" : ""}
                  </button>
                )}
                {selectedTask?.status === "active" && (
                  <div className="flex justify-between gap-3">
                    <button
                      onClick={() => markTaskAsCompleted(selectedTask._id)}
                      className={` w-full bg-[#00B64D] p-2 rounded-xl `}
                    >
                      {selectedTask?.status === "active"
                        ? "Mark as completed"
                        : ""}
                    </button>
                    <button
                      onClick={() => markTaskAsFailed(selectedTask._id)}
                      className={` w-full  bg-[#b24448] p-2 rounded-xl `}
                    >
                      {selectedTask?.status === "active"
                        ? "Mark as failed"
                        : ""}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default EmployesTasks;
