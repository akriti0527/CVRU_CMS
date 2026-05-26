import "../css/Category.css";
import { useState } from "react";

import burger from "../assets/burger.png";
import sandwich from "../assets/sandwich.png";
import drinks from "../assets/drinks.png";

function Category({ setCategory }) {
  const [active, setActive] = useState("All");

  const categories = [
    { name: "All", image: burger },
    { name: "Snacks", image: sandwich },
    { name: "Drinks", image: drinks },
   
  ];

  const handleClick = (name) => {
    setActive(name);
    setCategory(name.toLowerCase()); // 🔥 important
  };

  return (
    <div className="category-section">
      <h2 className="category-title">Order Menu</h2>

      <div className="category-container">
        {categories.map((item, index) => (
          <div
            key={index}
            className={`category-card ${
              active === item.name ? "active" : ""
            }`}
            onClick={() => handleClick(item.name)}
          >
            <img src={item.image} alt="" className="category-image" />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;