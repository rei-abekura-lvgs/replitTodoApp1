import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TaskProvider } from "./contexts/TaskContext";

createRoot(document.getElementById("root")!).render(
  <TaskProvider>
    <App />
  </TaskProvider>
);
