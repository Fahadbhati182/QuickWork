import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppConext";
import { useAdminContext } from "../../context/AdminContext";
import { RxCross2 } from "react-icons/rx";

const AddTask = () => {
  const navigate = useNavigate();

  const { setLoading, isAdmin} = useAppContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadLine, setDeadLine] = useState("");
  const [payment, setPayment] = useState("");


  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/admin/create-task", {
        title,
        description,
        assignedTo,
        deadLine,
        payment,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/admin/admin-tasks");
        setAssignedTo("");
        setTitle("");
        setDescription("");
        setDeadLine("");
        setPayment("");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    isAdmin && (
      <div className="h-screen flex items-center justify-center w-full p-4 bg-[#081622]">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-[##011929] via-[rgb(3,67,119)] to-[##000f1a] shadow-2xl rounded-2xl p-12 w-full max-w-3xl space-y-6"
        >
          <h2 className="text-4xl font-bold text-center text-white mb-3">
            Add Task
          </h2>

          <div>
            <label className="mt-3">Task Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg px-6 py-2 my-2 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mt-1">Task Desciption</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-lg px-6 py-2 my-2 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div>
            <label className="mt-1">Full Name of the Worker</label>
            <input
              type="text"
              placeholder="Assigned To"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full text-lg px-6 py-2 mb-3 mt-1 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mt-1">DeadLine</label>
            <input
              type="date"
              placeholder="Deadline"
              value={deadLine}
              onChange={(e) => setDeadLine(e.target.value)}
              className="w-full text-lg px-6 p-2 mb-2 mt-1 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label>Payment in Rupees</label>
            <input
              type="number"
              placeholder="Payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full text-lg px-6 py-2 my-2 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white text-xl p-2 my-2 rounded-lg hover:bg-blue-800 transition"
          >
            Add Task
          </button>
        </form>
      </div>
    )
  );
};

export default AddTask;
