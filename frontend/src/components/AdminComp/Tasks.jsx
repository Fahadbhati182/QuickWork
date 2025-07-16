import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Details from "./Details";
import { useAdminContext } from "../../context/AdminContext";
import { FaSearch } from "react-icons/fa";
import AllTasks from "./AllTasks";

const Tasks = () => {
  const navigate = useNavigate();

  const { adminTasks, getAllTasks } = useAdminContext();

  const [toShow, setToShow] = useState("all");
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const getAdminBasicDetails = async () => {
    const { data } = await axios.get("/api/admin/to-get-employeData");
    if (data.success) {
      setDatas(data.data.slice(2));
    }
  };

  useEffect(() => {
    if (search.length > 0) {
      setFilterData(
        adminTasks.filter((task) =>
          task.title.toLowerCase().includes(search.toLocaleLowerCase())
        )
      );
    }
  }, [search]);

  useEffect(() => {
    if (toShow) {
      setFilterData(adminTasks.filter((task) => task.status == toShow));
    }
  }, [toShow]);

  useEffect(() => {
    getAdminBasicDetails();
    getAllTasks();
  }, []);

  return (
    <div className="p-10 min-h-screen">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          {/* main header */}
          <div className="m-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Tasks Directory
            </h1>
          </div>
          <button
            onClick={() => navigate("/admin/add-task")}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-lg text-white text-lg font-semibold shadow"
          >
            Create Task
          </button>
        </div>
        <div className="flex justify-start items-center  mt-10">
          <FaSearch className="text-3xl text-white ml-3 mr-3" />
          <div className="flex items-center border pl-4 gap-2  h-12 rounded-full shadow-sm w-[800px]  ">
            <input
              type="text"
              placeholder="Search by task name.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-white outline-none text-xl bg-transparent"
            />
          </div>
        </div>

        <div>
          <Details datas={datas} />
        </div>

        <div className="flex justify-evenly items-center mt-10 mb-6">
          <h2
            onClick={() => setToShow("all")}
            className={`${
              toShow == "all"
                ? "bg-blue-500 text-white p-2 rounded-xl shadow transition"
                : "p-2 text-gray-700 hover:bg-blue-600 rounded-xl transition"
            } cursor-pointer font-medium mx-2`}
          >
            All
          </h2>
          <h2
            onClick={() => setToShow("newtask")}
            className={`${
              toShow == "newtask"
                ? "bg-blue-500 text-white p-2 rounded-xl shadow transition"
                : "p-2 text-gray-700 hover:bg-blue-600 rounded-xl transition"
            } cursor-pointer font-medium mx-2`}
          >
            New Task
          </h2>
          <h2
            onClick={() => setToShow("active")}
            className={`${
              toShow == "active"
                ? "bg-blue-500 text-white p-2 rounded-xl shadow transition"
                : "p-2 text-gray-700  hover:bg-blue-600 rounded-xl transition"
            } cursor-pointer font-medium mx-2`}
          >
            In Progress
          </h2>
          <h2
            onClick={() => setToShow("completed")}
            className={`${
              toShow == "completed"
                ? "bg-blue-500 text-white p-2 rounded-xl shadow transition"
                : "p-2 text-gray-700  hover:bg-blue-600 rounded-xl transition"
            } cursor-pointer font-medium mx-2`}
          >
            Completed
          </h2>
          <h2
            onClick={() => setToShow("failed")}
            className={`${
              toShow == "failed"
                ? "bg-blue-500 text-white p-2 rounded-xl shadow transition"
                : "p-2 text-gray-700  hover:bg-blue-600 rounded-xl transition"
            } cursor-pointer font-medium mx-2`}
          >
            Failed
          </h2>
        </div>
        <hr className="border-gray-300 mb-6" />
      </div>
      <div className="flex mt-5 justify-between items-center px-10 py-2 bg-blue-600 rounded-lg font-semibold   mb-2">
        <h3 className="w-1/3">Task</h3>
        <h3 className="w-1/3 text-center">Assign To</h3>
        <h3 className="w-1/3 text-right">Status</h3>
      </div>
      <div
        id="tasklist"
        className="flex flex-col gap-4 max-h-96 overflow-y-auto"
      >
        <AllTasks
          adminTasks={adminTasks}
          filterData={filterData}
          toShow={toShow}
          search={search}
        />
      </div>
    </div>
  );
};

export default Tasks;
