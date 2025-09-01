import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BlockchainContextProvider } from "../context/BlockchainContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BlockchainContextProvider>
      <App />
    </BlockchainContextProvider>
  </StrictMode>
);
