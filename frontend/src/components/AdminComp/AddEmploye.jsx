import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppConext";
import { useAdminContext } from "../../context/AdminContext";
import { RxCross2 } from "react-icons/rx";

const AddEmploye = () => {
  const navigate = useNavigate();

  const { setLoading, isAdmin } = useAppContext();

  const { isUpdateWorker, setIsUpdateWorker, updateWorkerData, getAllWorkers } =
    useAdminContext();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [skills, setSkills] = React.useState([]);
  const [singleSkill, setSingleSkill] = useState("");

  const handleAddSkill = () => {
    if (singleSkill && singleSkill.trim() !== "") {
      // Split input into words and add each as a skill
      const words = singleSkill.trim().split(/\s+/);
      setSkills([...skills, ...words]);
      setSingleSkill("");
    }
  };

  const deleteSkill = () => {
    if (skills.length > 0) {
      const updatedSkills = [...skills];
      updatedSkills.pop();
      setSkills(updatedSkills);
    }
  };

  const handleUpdateWorker = async () => {
    if (!isUpdateWorker) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/update-worker", {
        name,
        email,
        password,
        phone,
        skills,
        workerId: updateWorkerData._id,
      });
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        navigate("/admin/admin-workers");
        getAllWorkers();
        setEmail("");
        setName("");
        setPassword("");
        setSingleSkill("");
        setSkills("");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (isUpdateWorker) {
        handleUpdateWorker();
        return;
      } else {
        const { data } = await axios.post("/api/admin/add-worker", {
          name,
          email,
          password,
          phone,
          skills,
        });
        if (data.success) {
          toast.success(data.message);
          navigate("/admin/admin-workers");
          getAllWorkers();
          setEmail("");
          setName("");
          setPassword("");
          setSingleSkill("");
          setSkills("");
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUpdateWorker) {
      setName(updateWorkerData?.name);
      setEmail(updateWorkerData?.email);
      setPassword(updateWorkerData?.password);
      setPhone(updateWorkerData?.phone);
      setSkills([...updateWorkerData?.skills]);
    } else {
      setEmail("");
      setName("");
      setPassword("");
      setSingleSkill("");
      setSkills([]);
    }
  }, [isUpdateWorker, updateWorkerData]);

  return (
    isAdmin && (
      <div className="h-screen flex items-center justify-center w-full p-4 bg-[#081622]">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-[##011929] via-[rgb(3,67,119)] to-[##000f1a] shadow-2xl rounded-2xl p-12 w-full max-w-2xl space-y-6"
        >
          <h2 className="text-4xl font-bold text-center text-white mb-3">
            {isUpdateWorker ? "Update Worker Details" : "Add Employee"}
          </h2>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-lg px-6 py-2 my-2 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-lg px-6 py-2 my-2 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {!isUpdateWorker && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-lg px-6 py-2 my-2 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full text-lg px-6 py-2 my-2 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-evenly items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Add a skill"
                value={singleSkill}
                onChange={(e) => setSingleSkill(e.target.value)}
                className="w-full text-lg px-6 py-2 my-2 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
              />
              <FaPlus
                onClick={(e) => handleAddSkill(e)}
                className="absolute top-1/2 right-4 w-1/9 bg-blue-600 rounded-full transform -translate-y-1/2  text-white text-xl px-3 hover:bg-blue-700"
                style={{ height: "50%" }}
              />
            </div>
          </div>
          <div className="flex ">
            Your Skills : {skills.length == 0 && "No Skills"}
            <span className="flex ml-2 justify-evenly">
              <div className="flex">
                {skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-600 text-white px-2 py-1 rounded-full mr-2 mb-2 text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      className="ml-2 text-xs text-red-300 hover:text-red-500"
                      onClick={() => {
                        setSkills(skills.filter((_, i) => i !== idx));
                      }}
                    ></button>
                  </span>
                ))}
              </div>
              {isUpdateWorker && skills.length > 0 && (
                <RxCross2
                  onClick={deleteSkill}
                  className="  rounded-full ml-2   mt-1 bg-red-500  text-white text-xl px-2 hover:bg-red-700"
                  style={{ height: "60%", width: "60%" }}
                />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white text-xl  p-2 my-2 rounded-lg hover:bg-blue-800 transition"
          >
            {isUpdateWorker ? "Update Employe" : "Add Employe"}
          </button>
        </form>
      </div>
    )
  );
};

export default AddEmploye;
