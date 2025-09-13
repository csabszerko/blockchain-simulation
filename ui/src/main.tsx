import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NodeContextProvider } from "@/context/NodeContext.js";
import App from "./App.js";
import "./index.css";

import { ThemeProvider } from "@/components/theme-provider.js";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <NodeContextProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </NodeContextProvider>
  </StrictMode>
);
