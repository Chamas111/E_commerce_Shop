import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";
import "./NewCollections.css";

import Item from "../Item/Item";
const NewCollections = () => {
  const [new_collection, setNew_Collection] = useState([]);

  useEffect(() => {
    axios
      .get("/newcollections")
      .then((response) => {
        setNew_Collection(response.data);
      })
      .catch((error) => {
        console.error("Error fetching new collections:", error);
      });
  }, []);

  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
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

export default NewCollections;
