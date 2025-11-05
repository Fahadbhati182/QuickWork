import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Details from "./Details";
import { useAppContext } from "../../context/AppConext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "../../context/AdminContext";
import AllEmployes from "./AllEmployes";

const Employe = () => {
  const navigate = useNavigate();

  const { isAdmin } = useAppContext();
  const { getAllWorkers, adminWorkers, setAdminWorkers } = useAdminContext();

  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);

  const getAdminBasicDetails = async () => {
    const { data } = await axios.get("/api/admin/to-get-employeData");
    if (data.success) {
      setDatas(data.data.slice(0, 2));
    }
  };

  useEffect(() => {
    if (search.length > 0) {
      setFilteredWorkers(
        adminWorkers.filter((worker) =>
          worker.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [adminWorkers, search]);

  useEffect(() => {
    getAdminBasicDetails();
    getAllWorkers();
  }, []);

  return (
    <div className="px-2 py-6 sm:px-4 md:px-5 md:py-8 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 break-words">
            Employee Directory
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Manage and monitor your team members with ease
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/add-workers")}
          className="w-full sm:w-auto mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 transition-colors px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white text-base sm:text-lg font-semibold shadow"
        >
          Add Employee
        </button>
      </div>
      {/* SearchBar */}
      <div className="flex flex-col sm:flex-row justify-start items-stretch sm:items-center mt-8 gap-3">
        <div className="flex items-center border pl-3 gap-2 h-10 sm:h-12 rounded-full shadow-sm w-full max-w-full sm:w-[400px] md:w-[600px] lg:w-[800px] bg-transparent">
          <FaSearch className="text-2xl sm:text-3xl text-white mr-2" />
          <input
            type="text"
            placeholder="Search by name, skills"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full text-white outline-none text-base sm:text-xl bg-transparent"
          />
        </div>
      </div>
      {/* Overview Details */}
      <div className="mt-6">
        <Details datas={datas} />
      </div>
      {/* Each Employe Details  */}
      <div className="mt-6">
        <AllEmployes
          filteredWorkers={filteredWorkers}
          adminWorkers={adminWorkers}
          search={search}
        />
      </div>
    </div>
  );
};

export default Employe;
