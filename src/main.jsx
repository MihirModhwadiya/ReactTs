import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./mycomp/Auth/AuthContext/AuthContext";
import { ChatContextProvider } from "./mycomp/Main/Chat/ChatContext/ChatContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);
