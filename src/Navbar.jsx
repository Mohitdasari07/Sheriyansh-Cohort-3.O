import React from "react";
import { useContext } from "react";
import { ContextProvider, ProductData } from "./context/MyProducts";

const Navbar = () => {
  let { isCartOpen, setIsCartOpen } = useContext(ProductData);
  return (
    <div className="flex justify-between bg-blue-500 h-10 px-5 py-0.5 rounded-lg font-semibold">
      <h1>Mohit</h1>
      <div className="flex gap-[12vh]">
        <h1 onClick={() => setIsCartOpen(true)}>Home</h1>
        <h1 onClick={() => setIsCartOpen(false)}>Cart</h1>
      </div>
      <button className="h-full w-30 bg-[#ffff] rounded-2xl text-center text-blue-800">
        Log-In
      </button>
    </div>
  );
};

export default Navbar;
