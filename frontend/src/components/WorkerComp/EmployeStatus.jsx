import React, { useEffect } from "react";
import { assests } from "../../assets/assests";
import Details from "./Details";
import { useWorkerContext } from "../../context/WorkerContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppConext";
import { useState } from "react";
import { IoMdArrowDropleft } from "react-icons/io";

const EmployeStatus = () => {
  const { navigate, setLoading } = useAppContext();

  const {
    workerDetails,
    fetchWorkerDetails,
    fetchworkersAdminDetails,
    workerAdminDetails,
    fetchTaskCount,
    taskCount,
  } = useWorkerContext();

  const [isOpen, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    workerDetails?.profilePic || ""
  );
  const [preview, setPreview] = useState("");
  const [bio, setBio] = useState(workerDetails?.bio || "");

  const uploadBio = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      toast.error("Select File to Upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("bio", bio);

    try {
      setLoading(true);
      const { data } = await axios.post("/api/worker/upload-bio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        toast.success(data.message);
        fetchWorkerDetails();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const changeWorkerStatus = async () => {
    try {
      const { data } = await axios.put("/api/worker/change-status");

      if (data.success) {
        toast.success(data.message);
        fetchWorkerDetails();
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchWorkerDetails();
    fetchworkersAdminDetails();
    fetchTaskCount();
  }, []);

  useEffect(() => {
  if (!selectedImage) return;

  // Only create URL if it's a file or blob
  if (selectedImage instanceof File || selectedImage instanceof Blob) {
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  } else if (typeof selectedImage === "string") {
    setPreview(selectedImage); // It's likely a URL
  }
}, [selectedImage]);


  return (
    <>
      <div
        className={`p-10 relative w-full min-h-screen text-white ${
          isOpen ? "blur-xl" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-[#1e293b] tracking-wide drop-shadow">
            Employee Status
          </h1>
          <div onClick={() => setOpen(true)}>
            <img
              src={
                workerDetails?.profilePic == ""
                  ? assests.avatar_icon
                  : workerDetails?.profilePic
              }
              className="w-14 h-14 rounded-full "
              alt="Avatar"
            />
          </div>
        </div>
        <div className="flex flex-wrap  gap-10 justify-center items-center w-ful">
          {/* Employee Info Card */}
          <div className="flex-1  rounded-xl shadow-2xl p-6 flex-col  justify-between items-center  gap-2 border border-[#e0e7ff]">
            <div className="flex justify-between">
              {/* Left Side */}
              <div className="flex flex-col">
                <img
                  src={
                    workerDetails?.profilePic == ""
                      ? assests.avatar_icon
                      : workerDetails?.profilePic
                  }
                  className="w-40 h-40 rounded-full object-cover border-4 border-[#6366f1] shadow-lg "
                  alt="Employee"
                />
                <h1 className="text-2xl text-[#1e293b]">
                  {workerDetails?.name}
                </h1>
                <p className="text-md ">{workerDetails?.email}</p>
                <div className="text-md border p-3">{workerDetails?.bio || "No Bio"}</div>
                <p
                  onClick={() => navigate("/worker/settings")}
                  className="text-sm  text-red-500   px-1 cursor-pointer mb-5"
                >
                  {!workerDetails?.isAccountVerify && (
                    <span>Verify your email</span>
                  )}
                </p>
              </div>
              {/* Right Side */}
              <div className="flex   rounded-xl shadow-2xl p-8 flex-col   gap-2 border border-[#e0e7ff]">
                <h3>Your Admin Details</h3>
                <div className="flex justify-start gap-3 items-center mt-5 ">
                  <img
                    src={workerAdminDetails?.profilePic || assests.avatar_icon}
                    className="w-20 h-20 rounded-full object-cover  shadow-lg mb-4"
                    alt="Employee"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-[#1e293b]">
                      {workerAdminDetails?.name}
                    </h1>
                    <p className="text-[#6366f1] font-medium">
                      {workerAdminDetails?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/worker/messages")}
                  className="border-2 px-3 py-2 cursor-pointer rounded-sm border-[#6366f1] hover:bg-[#6366f1]"
                >
                  Message Admin
                </button>
              </div>
            </div>

            <div className="flex  justify-between">
              <div className="flex flex-col ">
                <p className="text-[#64748b]">Phone: {workerDetails?.phone}</p>
                <div className="flex flex-wrap gap-2 ">
                  Skills :
                  {workerDetails?.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-[#3739e0] text-white px-3 py-1 rounded-xl text-center text-sm font-semibold"
                    >
                      {skill?.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex  mt-5  rounded-xl shadow-2xl p-8 flex-col   gap-2 border border-[#e0e7ff]">
                <div className="flex justify-center items-center  gap-3">
                  <button
                    onClick={changeWorkerStatus}
                    className="border-2 px-3 py-2 cursor-pointer rounded-sm border-[#6366f1] hover:bg-[#6366f1]"
                  >
                    Change Status
                  </button>
                  <h3 className="text-center mt-2">
                    <span
                      className={`${
                        !workerDetails?.isActive
                          ? "bg-red-500 font-black px-3 py-2 rounded-md"
                          : "bg-green-500 font-black px-3 py-2  rounded-md"
                      }`}
                    >
                      {!workerDetails?.isActive ? " Inactive" : "Active"}
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Details datas={taskCount} isSelected={"No"} flexWrap={"No"} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute flex justify-center top-40 rounded-xl right-96 bg-gradient-to-br from-[#011929] via-[rgb(3,67,119)] to-[#000f1a] text-black w-1/2 h-[600px]">
          <IoMdArrowDropleft
            onClick={() => setOpen(false)}
            className="text-5xl cursor-pointer self-start mt-3 text-white"
          />
          <div className="text-white p-5 flex flex-col   rounded-sm justify-center gap-3  ">
            <div className="m-10">
              <h1 className="text-4xl font-bold text-[#1e293b] tracking-wide drop-shadow">
                Employe's Profile
              </h1>
              <form encType="multipart/form-data" onSubmit={uploadBio}>
                <div className="flex gap-5 justify-between items-center mt-10 border-2 p-3">
                  <div>
                    <label
                      htmlFor="avatar"
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="file"
                        id="avatar"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        name="image"
                        onChange={(e) => {
                          setSelectedImage(e.target.files[0]);
                        }}
                      />
                      <img
                        src={preview || assests.avatar_icon}
                        alt=""
                        className={`w-24 h-24 ${
                          selectedImage && "rounded-full"
                        }`}
                      />
                    </label>
                  </div>
                  <div>
                    <h3>{workerDetails?.name}</h3>
                    <h3>{workerDetails?.email}</h3>
                  </div>
                </div>
                <div onClick={() => setOpen(true)}>
                  <textarea
                    rows={5}
                    cols={5}
                    onChange={(e) => setBio(e.target.value)}
                    value={bio}
                    name="bio"
                    placeholder="bio.."
                    id=""
                    className="w-full h-full border-1 p-2 rounded-xl hover:border-2 mt-3"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full  mt-3  bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Update Bio
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeStatus;
