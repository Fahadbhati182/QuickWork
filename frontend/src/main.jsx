import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppConext.jsx";
import { WorkerContextProvider } from "./context/WorkerContext.jsx";
import { AdminContextProvider } from "./context/AdminContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { MessageContextProvider } from "./context/MessageContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <MessageContextProvider>
        <AdminContextProvider>
          <WorkerContextProvider>
            <App />
          </WorkerContextProvider>
        </AdminContextProvider>
      </MessageContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);
