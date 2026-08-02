import React from "react";
import { useContext } from "react";
import { ProductData } from "./context/MyProducts";
import Navbar from "./Navbar";
const Cart = () => {
  let { cartData, setCartData } = useContext(ProductData);
  console.log(cartData);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">🛒 Shopping Cart</h1>

      <div className="space-y-6">
        {cartData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-6"
          >
            {/* Image */}
            <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold line-clamp-2">
                {item.title}
              </h2>

              <p className="text-gray-500 mt-2">{item.category}</p>

              <p className="text-2xl font-bold text-green-600 mt-3">
                ${item.price}
              </p>
            </div>

            {/* Rating */}
            <div className="text-center">
              <p className="text-yellow-500 text-lg">⭐ {item.rating.rate}</p>
              <p className="text-gray-500 text-sm">
                {item.rating.count} Reviews
              </p>
            </div>

            {/* Remove Button */}
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
              onClick={() =>
                setCartData((prev) => prev.filter((i) => i.id !== item.id))
              }
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
