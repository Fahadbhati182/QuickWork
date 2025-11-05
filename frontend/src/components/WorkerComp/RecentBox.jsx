import React from "react";
const RecentBox = ({ data, isSelected, setToShow }) => {
  return (
    <div className="p-2 w-full">
      <div
        onClick={() => setToShow(data?.title)}
        key={data.title}
        className={`flex ${
          data?.title === "Active Task"
            ? "bg-[#E2A000]"
            : data?.title === "Completed Task"
            ? "bg-[#00B64D]"
            : data?.title === "Failed Task"
            ? "bg-[#b24448]"
            : "bg-[#2472FF]"
        } items-center gap-4 p-10 rounded-xl shadow transition-transform hover:scale-105  text-white`}
      >
        <div className="text-4xl font-extrabold">{data.count}</div>
        <div className="flex-1">
          <div className="text-2xl font-semibold">{data.title}</div>
          {isSelected == "Yes" ? (
            <div className="h-1 mt-2 rounded bg-white/30 w-3/4"></div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentBox;
