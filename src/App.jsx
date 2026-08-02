import React from "react";
import Cart from "./Cart";
import { useContext } from "react";
import { ContextProvider, ProductData } from "./context/MyProducts";
import Home from "./Home";
const App = () => {
  let { isCartOpen, setIsCartOpen } = useContext(ProductData);
  console.log(isCartOpen);
  return <div>{isCartOpen ? <Home /> : <Cart />}</div>;
};

export default App;
