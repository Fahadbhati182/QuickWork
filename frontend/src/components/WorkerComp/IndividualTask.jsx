import React from "react";

const statusStyles = {
  active: {
    bg: "bg-yellow-500",
    badge: "bg-yellow-700",
  },
  completed: {
    bg: "bg-green-600",
    badge: "bg-green-800",
  },
  failed: {
    bg: "bg-red-500",
    badge: "bg-red-700",
  },
  default: {
    bg: "bg-blue-600",
    badge: "bg-blue-800",
  },
};

const IndividualTask = ({
  task,
  isOpenTaskDetail,
  setSelectedTask,
  setIsOpenTaskDetaisl,
}) => {
  const { title, payment, deadLine, status } = task || {};
  const { bg, badge } = statusStyles[status] || statusStyles.default;


  return (
    <div
      className={`${bg} p-6 sm:p-8 rounded-2xl min-w-[250px] sm:min-w-[280px] mx-2 sm:mx-3 transition-transform hover:scale-[1.03] duration-300 shadow-lg`}
    >
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-sm">
          {title}
        </h2>
      </div>

      {/* Payment */}
      <div className="flex items-center mb-3">
        <span className="text-white text-sm mr-2">Payment:</span>
        <span className="bg-white/30 text-white font-medium text-sm px-3 py-1 rounded-full">
          ₹{payment}
        </span>
      </div>

      {/* Deadline */}
      <div className="flex items-center mb-3">
        <span className="text-white text-sm mr-2">Deadline:</span>
        <span className="bg-orange-700 text-white text-sm font-medium px-3 py-1 rounded-full">
          {deadLine}
        </span>
      </div>

      {/* Status Badge */}
      <div className="mb-5">
        <span
          className={`text-white text-sm font-semibold px-3 py-1 rounded-full inline-block ${badge}`}
        >
          {status}
        </span>
      </div>

      {/* Action Button */}
      <div>
        {status == "active" && (
          <button
            onClick={() => {
              setIsOpenTaskDetaisl(true);
              setSelectedTask(task);
            }}
            className="w-full bg-black text-white text-sm font-semibold py-2 rounded-xl hover:bg-gray-800 transition-colors duration-200"
          >
            Edit Status
          </button>
        )}
        {status == "newtask" && (
          <button
            onClick={() => {
              setIsOpenTaskDetaisl(true);
              setSelectedTask(task);
            }}
            className="w-full bg-black text-white text-sm font-semibold py-2 rounded-xl hover:bg-gray-800 transition-colors duration-200"
          >
            Edit Status
          </button>
        )}
      </div>
    </div>
  );
};

export default IndividualTask;
