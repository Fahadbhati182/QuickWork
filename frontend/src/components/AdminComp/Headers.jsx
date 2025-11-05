import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppConext";
import axios from "axios";
import { useState } from "react";
import { assests } from "../../assets/assests";
import { useAdminContext } from "../../context/AdminContext";
import { IoMdArrowDropleft } from "react-icons/io";
import toast from "react-hot-toast";
import { useEffect } from "react";
const Headers = () => {
  const { isAdmin, setUser, setIsAdmin, setLoading } = useAppContext();
  const { adminDetails, isProfileOpen, setIsProfileOpen, fetchAdminDetails } =
    useAdminContext();

  const [showDropdown, setShowDropdown] = useState();
  const [file, setFile] = useState(null);

  const logout = async () => {
    const { data } = await axios.get("/api/admin/logout");
    console.log(data);
    if (data.success) {
      setUser("");
      setIsAdmin(false);
    }
  };

  const uploadProfilePic = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
      } else {
        toast.error("Select File to Upload");
      }

      const { data } = await axios.post(
        "/api/admin/upload-profilePic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setIsProfileOpen(false);
        fetchAdminDetails();
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    isAdmin && (
      <header className="w-full flex justify-center">
        {/* <div class="absolute inset-0 backdrop-blur-sm bg-black/30"></div> */}
        <div
          className={`flex z-50 flex-col sm:flex-row justify-between w-full items-center ${
            isProfileOpen && "blur-md"
          }  space-y-4 sm:space-y-0 sm:space-x-3 px-3 pt-5`}
        >
          <span
            className={`text-white flex flex-col font-bold tracking-wide  ${
              isProfileOpen && "blur-md"
            } drop-shadow-lg text-center sm:text-left`}
          >
            <h1 className="mt-2 text-xl sm:text-2xl font-bold">
              Welcome, AdminðŸ‘‹
            </h1>
            {!isAdmin && (
              <p className="text-red-500 text-base sm:text-lg">
                {" "}
                Login for Your Details{" "}
              </p>
            )}
            {adminDetails && (
              <h3 className="self-start text-blue-500">{adminDetails.name} </h3>
            )}
          </span>
          <div className="relative">
            <img
              onClick={() => setShowDropdown((prev) => !prev)}
              src={adminDetails?.profilePic || assests.avatar_icon}
              alt="User Icon"
              className="w-10 sm:w-12 h-10 sm:h-12 cursor-pointer rounded-full border-2 shadow-md"
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-[#31312f] rounded shadow-lg z-10">
                <button
                  className="block w-full text-left text-base sm:text-xl px-4 py-2"
                  onClick={() => {
                    setShowDropdown(false);
                    setIsProfileOpen((prev) => !prev);
                  }}
                >
                  ProfilePic
                </button>
                <button
                  className="block w-full text-left px-4 py-2"
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <hr className="border-gray-700 mb-6" />

        {/* Upload file  */}
        {isProfileOpen && (
          <>
            <div className="w-1/3 absolute h-1/3 rounded-sm bg-white z-100 mt-50 bg-gradient-to-br from-[#011929] via-[rgb(3,67,119)] to-[#000f1a]">
              <div className="flex gap-3 items-center mt-3">
                <IoMdArrowDropleft
                  onClick={() => setIsProfileOpen(false)}
                  className="text-5xl cursor-pointer"
                />
                <h3>Make your profile more Attractive</h3>
              </div>
              <form
                encType="multipart/form-data"
                onSubmit={uploadProfilePic}
                className="flex flex-col p-10"
              >
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  placeholder="uplaod profilePic"
                  type="file"
                  name="image"
                  id="image-upload"
                  className="mb-4 border px-2 py-3 rounded-xl"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Upload
                </button>
              </form>
            </div>
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
          </>
        )}
      </header>
    )
  );
};

export default Headers;
