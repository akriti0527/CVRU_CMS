import "../css/AddItem.css";

import { useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";



function AddItem() {

  const navigate = useNavigate();



  // ======================================
  // STATE
  // ======================================

  const [foodData, setFoodData] = useState({

    name: "",

    category: "All",

    price: "",

    status: "Available",

    image: null,
  });



  // ======================================
  // HANDLE INPUT CHANGE
  // ======================================

  const handleChange = (e) => {

    setFoodData({

      ...foodData,

      [e.target.name]:
      e.target.value,
    });
  };



  // ======================================
  // HANDLE IMAGE
  // ======================================

  const handleImageChange = (e) => {

    setFoodData({

      ...foodData,

      image: e.target.files[0],
    });
  };



  // ======================================
  // HANDLE SUBMIT
  // ======================================

  const handleSubmit = async (e) => {

    e.preventDefault();



    try {

      // ======================================
      // CREATE FORMDATA
      // ======================================

      const formData =
      new FormData();



      formData.append(
        "name",
        foodData.name
      );



      formData.append(
        "category",
        foodData.category
      );



      formData.append(
        "price",
        foodData.price
      );



      formData.append(
        "status",
        foodData.status
      );



      formData.append(
        "image",
        foodData.image
      );



      // ======================================
      // API CALL
      // ======================================

      const response =
      await axios.post(

        "http://localhost:5000/api/v1/foods/",

        formData,

        {

          withCredentials: true,

          headers: {

            "Content-Type":
            "multipart/form-data"
          }
        }
      );



      console.log(response.data);



      toast.success(
        "Food Item Added Successfully 🎉"
      );



      // REDIRECT
      navigate("/admin/menu");

    } catch (error) {

      console.log(error);



      toast.error(

        error.response?.data?.message
        || "Failed to add food item"
      );
    }
  };




  return (

    <div className="add-item-page">

      <div className="add-item-container">

        <h1>
          Add Food Item
        </h1>



        <form onSubmit={handleSubmit}>


          {/* FOOD NAME */}
          <input

            type="text"

            name="name"

            placeholder="Enter Food Name"

            value={foodData.name}

            onChange={handleChange}

            required
          />



          {/* CATEGORY */}
          <select

            name="category"

            value={foodData.category}

            onChange={handleChange}
          >

            <option value="All">
              All
            </option>

            <option value="Snacks">
              Snacks
            </option>

            <option value="Drinks">
              Drinks
            </option>

            <option value="Beverages">
              Beverages
            </option>

          </select>



          {/* PRICE */}
          <input

            type="number"

            name="price"

            placeholder="Enter Price"

            value={foodData.price}

            onChange={handleChange}

            required
          />



          {/* STATUS */}
          <select

            name="status"

            value={foodData.status}

            onChange={handleChange}
          >

            <option value="Available">
              Available
            </option>

            <option value="Not Available">
              Not Available
            </option>

            <option value="Out of Stock">
              Out of Stock
            </option>

          </select>



          {/* IMAGE */}
          <input

            type="file"

            accept="image/*"

            onChange={handleImageChange}

            required
          />



          {/* BUTTON */}
          <button type="submit">

            Add Item

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddItem;