import { createRoot } from "react-dom/client";
import "./index.css";
import Navbar from "./Navbar";
import App from "./App";
import { ContextProvider } from "./context/MyProducts";

createRoot(document.getElementById("root")).render(
  <div className="bg-[#ffff] text-[22px] my-5 mx-10">
    <ContextProvider>
      <Navbar />
      <App />
    </ContextProvider>
  </div>,
);
