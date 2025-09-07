import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NodeContextProvider } from "../context/NodeContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NodeContextProvider>
      <App />
    </NodeContextProvider>
  </StrictMode>
);
