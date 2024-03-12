import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";
import "./Popular.css";

import Item from "../Item/Item";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  useEffect(() => {
    axios
      .get("/popularinwomen")
      .then((response) => {
        setPopularProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching new collections:", error);
      });
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
