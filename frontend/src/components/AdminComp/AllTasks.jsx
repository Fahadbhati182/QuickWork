import React from "react";

const AllTasks = ({ adminTasks, filterData, toShow, search }) => {
  return adminTasks.length > 0 ? (
    <div id="tasklist" className="overflow-auto  mb-10 mt-2 bg-gradient-to-br from-[#010101] via-[rgb(12,33,96)] to-[#010101] p-10 rounded-xl">
      {toShow == "all" && search.length == 0 ? (
        <div>
          {adminTasks.map((task) => (
            <div
              key={task._id}
              className="flex justify-between items-center px-10 py-4 border  rounded-lg shadow mb-4"
            >
              <div className="w-1/3 font-medium ">
                {task.title}
              </div>
              <div className="w-1/3 text-center">
                {task.assignedTo || "Unassigned"}
              </div>
              <div className="w-1/3 text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    task.status === "completed"
                      ? "bg-green-500 "
                      : task.status === "active"
                      ? "bg-yellow-500 "
                      : task.status === "failed"
                      ? "bg-red-500 "
                      : "bg-blue-500"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {filterData.map((task) => (
            <div
              key={task._id}
              className="flex justify-between items-center px-10 py-4 border  rounded-lg shadow mb-4"
            >
              <div className="w-1/3 font-medium text-white">
                {task.title}
              </div>
              <div className="w-1/3 text-center text-white">
                {task.assignedTo || "Unassigned"}
              </div>
              <div className="w-1/3 text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    task.status === "completed"
                      ? "bg-green-500 "
                      : task.status === "active"
                      ? "bg-yellow-500 "
                      : task.status === "failed"
                      ? "bg-red-500 "
                      : "bg-blue-500"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="mt-3 flex justify-center  rounded-xl shadow-lg p-10 overflow-auto bg-gradient-to-br from-[#010101] via-[rgb(12,33,96)] to-[#010101]">
      No Tasks
    </div>
  );
};

export default AllTasks;
