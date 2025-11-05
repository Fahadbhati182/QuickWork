import React from "react";

const TaskNumberList = ({ data }) => {
  return (
    <div className="flex flex-col sm:flex-row mt-10 justify-between gap-6">
      <div className="rounded-xl w-full sm:w-1/5 py-8 px-8 bg-gradient-to-br from-red-400 to-red-600 shadow-lg flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {data?.taskCount.newTask}
        </h2>
        <h3 className="text-lg font-semibold text-white tracking-wide">
          New Task
        </h3>
      </div>
      <div className="rounded-xl w-full sm:w-1/5 py-8 px-8 bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {data?.taskCount.active}
        </h2>
        <h3 className="text-lg font-semibold text-white tracking-wide">
          In Progress
        </h3>
      </div>
      <div className="rounded-xl w-full sm:w-1/5 py-8 px-8 bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {data?.taskCount.completed}
        </h2>
        <h3 className="text-lg font-semibold text-white tracking-wide">
          Completed
        </h3>
      </div>
      <div className="rounded-xl w-full sm:w-1/5 py-8 px-8 bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {data?.taskCount.failed}
        </h2>
        <h3 className="text-lg font-semibold text-white tracking-wide">
          failed
        </h3>
      </div>
    </div>
  );
};

export default TaskNumberList;
