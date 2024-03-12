import React, { createContext, useEffect, useState } from "react";
import axios from "../Components/axiosInstance";
export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }

  return cart;
};
const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartsItem] = useState(getDefaultCart());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProductsResponse = await axios.get("/allproducts");
        setAll_Product(allProductsResponse.data);

        if (localStorage.getItem("auth-token")) {
          const cartResponse = await axios.post(
            "/getcart",
            {},
            {
              headers: {
                Accept: "Application/form-data",
                "auth-token": localStorage.getItem("auth-token"),
                "Content-Type": "application/json",
              },
            }
          );
          console.log(cartResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const addToCart = (itemId) => {
    setCartsItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    if (localStorage.getItem("auth-token")) {
      axios
        .post(
          "/addtocart",
          { itemId: itemId },
          {
            headers: {
              Accept: "Application/form-data",
              "auth-token": localStorage.getItem("auth-token"),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => console.log(response.data))
        .catch((error) => console.error("Error adding to cart:", error));
    }
  };

  const removeFromCart = (itemId) => {
    setCartsItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (localStorage.getItem("auth-token")) {
      axios
        .post(
          "/removefromcart",
          { itemId: itemId },
          {
            headers: {
              Accept: "Application/form-data",
              "auth-token": localStorage.getItem("auth-token"),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => console.log(response.data))
        .catch((error) => console.error("Error removing from cart:", error));
    }
  };
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        console.log("ddd" + all_product);
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }

    return totalItem;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
