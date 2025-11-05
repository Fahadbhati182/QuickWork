import React from "react";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainBanner from "./components/AdminComp/MainBanner";
import Tasks from "./components/AdminComp/Tasks";
import Employe from "./components/AdminComp/Employe";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppConext";
import EmployeDashboard from "./components/Dashboard/EmployeDashboard";
import AddEmploye from "./components/AdminComp/AddEmploye";
import Loading from "./components/Others/Loading";
import AddTask from "./components/AdminComp/AddTask";
import Setting from "./components/AdminComp/Setting";
import Otp from "./components/AdminComp/Otp";
import EmployesTasks from "./components/WorkerComp/EmployesTasks";
import EmployeBanner from "./components/WorkerComp/EmployeBanner";
import { useEffect } from "react";
import WelcomePage from "./components/AdminComp/WelcomePage";
import ErrorBoundary from "./ErrorBoundary";
import EmployeStatus from "./components/WorkerComp/EmployeStatus";
import EmployeSettings from "./components/WorkerComp/EmployeSettings";
import EmployeOtp from "./components/WorkerComp/EmployeOtp";
import VerifyEmail from "./components/WorkerComp/VerifyEmail";
import EmployeMessage from "./components/WorkerComp/EmployeMessage";
import AdminMessages from "./components/AdminComp/AdminMessages";

const App = () => {
  const { loading } = useAppContext();

  if (loading) return <Loading />;

  return (
    <>
      <Toaster />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<MainBanner />} />
            <Route path="admin-workers" element={<Employe />} />
            <Route path="add-workers" element={<AddEmploye />} />
            <Route path="admin-tasks" element={<Tasks />} />
            <Route path="add-task" element={<AddTask />} />
            <Route path="settings" element={<Setting />} />
            <Route path="send-reset-otp" element={<Otp />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
          <Route path="/worker" element={<EmployeDashboard />}>
            <Route index element={<EmployeBanner />} />
            <Route path="tasks" element={<EmployesTasks />} />
            <Route path="status" element={<EmployeStatus />} />
            <Route path="settings" element={<EmployeSettings />} />
            <Route path="send-verify-otp" element={<VerifyEmail />} />
            <Route path="send-reset-otp" element={<EmployeOtp />} />
            <Route path="messages" element={<EmployeMessage />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default App;
