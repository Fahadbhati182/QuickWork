import React from "react";
import EmployeDetails from "./EmployeDetails";

const AllEmployes = ({ adminWorkers, filteredWorkers, search }) => {
  return adminWorkers.length > 0 ? (
    <>
      <div
        id="tasklist"
        className="p-8 mt-20   rounded-xl shadow-lg h-75 overflow-auto bg-gradient-to-br from-[#010101] via-[rgb(12,33,96)] to-[#010101]"
      >
        <div className="flex flex-row  items-center  rounded-md  gap-15 ">
          <p className="w-[300px] text-xl  text-white p-2 rounded-full text-center font-semibold">
            Name
          </p>
          <p className="w-[500px] text-xl text-white p-2 rounded-full text-center font-semibold">
            Skils
          </p>
          <h5 className="w-[300px]  ml-10 text-xl  text-white p-2 rounded-full text-center font-semibold">
            Status
          </h5>
          <h5 className="w-[200px] text-xl  text-white  p-2 rounded-full text-center font-semibold">
            Actions
          </h5>
        </div>
        <hr className="border-gray-700 mb-6" />
        {search.length > 0 ? (
          <div
            id="tasklist"
            className="flex flex-col gap-4 max-h-96 overflow-y-auto"
          >
            {filteredWorkers.map((user, idx) => (
              <EmployeDetails key={idx} user={user} />
            ))}
          </div>
        ) : (
          <div
            id="tasklist"
            className="flex flex-col gap-4 max-h-96 overflow-y-auto"
          >
            {adminWorkers.map((user, idx) => (
              <EmployeDetails key={idx} user={user} />
            ))}
          </div>
        )}
      </div>
    </>
  ) : (
    <div className="mt-20 flex justify-center  rounded-xl shadow-lg p-10 overflow-auto bg-gradient-to-br from-[#010101] via-[rgb(12,33,96)] to-[#010101]">
      No Employees
    </div>
  );
};

export default AllEmployes;
