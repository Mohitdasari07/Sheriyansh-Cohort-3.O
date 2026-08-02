import React from "react";
import { useContext } from "react";
import { ProductData } from "./context/MyProducts";
const Home = () => {
  const { storeData, setCartData } =
    useContext(ProductData);

  let cartClick = (data) => {
    setCartData((prev) => [...prev, data]);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {storeData.map((val) => (
        <div
          key={val.id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
        >
          <div className="h-60 flex items-center justify-center bg-gray-100 p-4">
            <img
              src={val.image}
              alt={val.title}
              className="h-full object-contain"
            />
          </div>

          <div className="p-4">
            <h2 className="font-semibold text-lg line-clamp-2">{val.title}</h2>

            <p className="text-green-600 text-xl font-bold mt-2">
              ${val.price}
            </p>

            <p className="text-yellow-500 mt-1">⭐ {val.rating.rate}</p>

            <button
              className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              onClick={() => cartClick(val)}
            >
              Add To Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
