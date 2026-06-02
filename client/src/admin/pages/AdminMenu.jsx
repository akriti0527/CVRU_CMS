/* eslint-disable no-undef */
/* eslint-disable react-hooks/set-state-in-effect */
import "../css/AdminMenu.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../utils/axios";
//import apiClient from "../../api/apiClient"; // Use your configured instance
//import socket from "../../socket"
//import bannerImg from "../../assets/banner.png";
function AdminMenu() {
  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */
  const [foods, setFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSection, setSelectedSection] = useState("breakfast");
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- FETCH ALL FOODS ---------------- */
  const fetchFoods = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/foods/`);
      if (res.data?.success) {
        setFoods(res.data.foods);
      }
    } catch (error) {
      console.log("Error fetching foods:", error);
    }
  };
  // =========================================
// TOGGLE FOOD AVAILABILITY
// =========================================

const toggleAvailability =
  async (foodId) => {
const token = localStorage.getItem("token");
    try {

      const response =
        await axios.put(

          `${import.meta.env.VITE_API_URL}/api/v1/foods/toggle-availability/${foodId}`,

          {},

          {
             headers: {
      Authorization: `Bearer ${token}`,
    },
            withCredentials: true
          }
        );







      // UPDATE UI
      setFoods(

        foods.map(

          (item) =>

            item._id === foodId

              ? response.data.food

              : item
        )
      );







      toast.success(

        response.data.food
          .isAvailable

          ? "Food Enabled"

          : "Food Disabled"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to update"
      );
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);
// =========================================
// TOGGLE AVAILABILITY
// =========================================

// =========================================
// DELETE FOOD
// =========================================

const deleteFood = async (
  foodId
) => {

  const confirmDelete =
    window.confirm(

      "Delete this food item?"
    );







  if (!confirmDelete)
    return;





const token = localStorage.getItem("token");

  try {

    await axios.delete(

      `${import.meta.env.VITE_API_URL}/api/v1/foods/${foodId}`,

      {
         headers: {
      Authorization: `Bearer ${token}`,
    },
        withCredentials: true
      }
    );







    // REMOVE FROM UI
    setFoods(

      foods.filter(

        (item) =>

          item._id !== foodId
      )
    );







    toast.success(
      "Food Deleted"
    );

  } catch (error) {

    console.log(error);

    toast.error(
      "Delete Failed"
    );
  }
};
  /* ---------------- UPDATE AVAILABILITY STATUS ---------------- */
  // eslint-disable-next-line no-unused-vars
  const updateFood = async (id) => {

  try {

    const response =
      await API.put(

        `/foods/availability//${id}`,

        {

          name,

          price,

          category
        }
      );



    alert(
      response.data.message
    );

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message
    );
  }
};

  /* ---------------- DELETE FOOD ---------------- */


  

  // const updateLunchStatus = (id, newStatus) => {
  //   setLunchMenu((prev) =>
  //     prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
  //   );
  // };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredFoods = foods.filter((item) => {
    const matchCategory = activeCategory === "All" ? true : item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div
      className="admin-menu-page"
      style={{
        //backgroundImage: `url(${bannerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* TOP BAR */}
      <div className="admin-menu-top">
        <h1 className="admin-menu-heading">Menu Management</h1>
        <input
          type="text"
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => navigate("/admin/add-item")}>+ Add Item</button>
      </div>

      {/* TIMELINE VIEW */}
      <div className="admin-timeline-section">
        <div
          className={`timeline-box ${selectedSection === "breakfast" ? "active-timeline" : ""}`}
          onClick={() => setSelectedSection("breakfast")}
        >
          <h2>AVAILABLE MEALS</h2>
          <p>8:00 AM - 5:00 PM</p>
        </div>
      </div>

      {/* CATEGORY SELECTOR */}
      <div className="admin-category-section">
        {["All", "Snacks", "Drinks"].map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? "active-category" : ""}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FOOD GRID CARDS */}
      <div className="admin-food-grid">
        {filteredFoods.map((item) => (
          <div className="admin-food-card" key={item._id}>
            <img src={`${import.meta.env.VITE_API_URL}/${item.image}`} alt={item.name} />
            <div className="food-content">
              <h2>{item.name}</h2>
              <h3>₹ {item.price}</h3>
              <div className="food-status">
 <div className="food-actions">

  {/* AVAILABILITY */}

  <div className="availability-box">

    <span
      className={
        item.isAvailable

          ? "available-text"

          : "unavailable-text"
      }
    >

      {

        item.isAvailable

          ? "Available"

          : "Unavailable"
      }

    </span>





    <button

      className={
        item.isAvailable

          ? "disable-btn"

          : "enable-btn"
      }

      onClick={() =>

        toggleAvailability(
          item._id
        )
      }
    >

      {

        item.isAvailable

          ? "Disable"

          : "Enable"
      }

    </button>

  </div>







  {/* DELETE BUTTON */}

  <button

    className="delete-food-btn"

    onClick={() =>

      deleteFood(
        item._id
      )
    }
  >

    Delete Food

  </button>

</div>
              </div>

             

             
            </div>
          </div>
        ))}
      </div>

      {/* LUNCH MENU BACKUP SECTION */}
      
    </div>
  );
}

export default AdminMenu;