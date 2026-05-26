/* eslint-disable react-hooks/set-state-in-effect */
import "../css/AdminHome.css";

import {

  FaShoppingBag,

  FaCheckCircle,

  FaMoneyBillWave,

  FaTimesCircle

} from "react-icons/fa";

import {

  useEffect,

  useState

} from "react";

import axios from "axios";

function AdminHome() {

  // =========================================
  // STATES
  // =========================================

  const [stats, setStats] =
    useState({

      totalOrders: 0,

      deliveredOrders: 0,

      cancelledOrders: 0,

      totalRevenue: 0
    });




  const [foods, setFoods] =
    useState([]);




  // eslint-disable-next-line no-unused-vars
  const [orders, setOrders] =
    useState([]);




  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================

  const fetchDashboardData =
    async () => {

      try {

        // =====================================
        // FETCH ORDERS
        // =====================================

        const orderRes =
          await axios.get(

            "http://localhost:5000/api/v1/orders/admin/active-orders",

            {
              withCredentials: true
            }
          );




        const allOrders =
          orderRes.data.orders || [];




        // =====================================
        // FETCH FOODS
        // =====================================

        const foodRes =
          await axios.get(

            "http://localhost:5000/api/v1/foods/"
          );




        const allFoods =
          foodRes.data.foods ||

          foodRes.data ||

          [];




        // =====================================
        // CALCULATIONS
        // =====================================

        const delivered =
          allOrders.filter(

            (o) =>

              o.orderStatus ===
              "delivered"
          );




        const cancelled =
          allOrders.filter(

            (o) =>

              o.orderStatus ===
              "cancelled"
          );




        const revenue =
          delivered.reduce(

            (acc, item) =>

              acc +
              item.totalAmount,

            0
          );




        // =====================================
        // UPDATE STATE
        // =====================================

        setStats({

          totalOrders:
            allOrders.length,

          deliveredOrders:
            delivered.length,

          cancelledOrders:
            cancelled.length,

          totalRevenue:
            revenue
        });




        setFoods(allFoods);

        setOrders(allOrders);

      } catch (error) {

        console.log(
          "Dashboard Error:",
          error
        );
      }
    };




  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {

    fetchDashboardData();




    // AUTO REFRESH
    const interval =
      setInterval(() => {

        fetchDashboardData();

      }, 5000);




    return () =>
      clearInterval(interval);

  }, []);




  return (

    <div className="admin-home">

      {/* ========================================= */}
      {/* TOP STATS */}
      {/* ========================================= */}

      <div className="admin-stats-grid">




        {/* TOTAL ORDERS */}

        <div className="admin-stat-card">

          <div className="admin-card-icon">
            <FaShoppingBag />
          </div>

          <h2>
            Total Orders
          </h2>

          <h1>
            {stats.totalOrders}
          </h1>

          <p>
            Live Orders
          </p>

        </div>




        {/* DELIVERED */}

        <div className="admin-stat-card">

          <div className="admin-card-icon">
            <FaCheckCircle />
          </div>

          <h2>
            Delivered
          </h2>

          <h1>
            {stats.deliveredOrders}
          </h1>

          <p>
            Successfully Delivered
          </p>

        </div>




        {/* REVENUE */}

        <div className="admin-stat-card">

          <div className="admin-card-icon">
            <FaMoneyBillWave />
          </div>

          <h2>
            Total Revenue
          </h2>

          <h1>
            ₹ {stats.totalRevenue}
          </h1>

          <p>
            Total Earnings
          </p>

        </div>




        {/* CANCELLED */}

        <div className="admin-stat-card">

          <div className="admin-card-icon">
            <FaTimesCircle />
          </div>

          <h2>
            Cancelled
          </h2>

          <h1>
            {stats.cancelledOrders}
          </h1>

          <p>
            Cancelled Orders
          </p>

        </div>

      </div>





      {/* ========================================= */}
      {/* ANALYTICS */}
      {/* ========================================= */}

      <div className="admin-analytics-grid">




        {/* SALES ANALYTICS */}

        <div className="admin-chart-box">

          <div className="box-header">

            <h2>
              Sales Analytics
            </h2>

            <button>
              Live
            </button>

          </div>




          <div className="circle-wrapper">




            <div className="circle-card">

              <div className="circle-progress">

                {

                  stats.totalOrders > 0

                  ?

                  Math.floor(

                    (stats.deliveredOrders /

                    stats.totalOrders)

                    * 100
                  )

                  :

                  0

                }%

              </div>

              <p>
                Delivered
              </p>

            </div>





            <div className="circle-card">

              <div className="circle-progress">

                ₹

                {

                  Math.floor(

                    stats.totalRevenue / 1000
                  )

                }K

              </div>

              <p>
                Revenue
              </p>

            </div>





            <div className="circle-card">

              <div className="circle-progress">

                {foods.length}

              </div>

              <p>
                Food Items
              </p>

            </div>

          </div>

        </div>





        {/* LIVE ORDER GRAPH */}

        <div className="admin-chart-box">

          <div className="box-header">

            <h2>
              Order Analytics
            </h2>

            <button>
              Live
            </button>

          </div>




          <div className="real-line-graph">

            <svg viewBox="0 0 500 220">

              <path

                d="
                M 0 170
                C 50 120, 80 190, 120 140
                S 200 90, 240 130
                S 320 200, 360 100
                S 430 60, 500 120
                "

                fill="none"

                stroke="#ffd000"

                strokeWidth="5"

                strokeLinecap="round"
              />

            </svg>

          </div>

        </div>

      </div>





      {/* ========================================= */}
      {/* LOWER GRID */}
      {/* ========================================= */}

      <div className="admin-lower-grid">




        {/* REVENUE GRAPH */}

        <div className="admin-chart-box">

          <div className="box-header">

            <h2>
              Revenue Analytics
            </h2>

            <button>
              2026
            </button>

          </div>




          <div className="real-line-graph revenue-line">

            <svg viewBox="0 0 500 220">

              <path

                d="
                M 0 180
                C 60 140, 90 190, 140 120
                S 240 70, 290 130
                S 360 180, 410 80
                S 460 60, 500 100
                "

                fill="none"

                stroke="#ffd000"

                strokeWidth="5"

                strokeLinecap="round"
              />

            </svg>

          </div>

        </div>





        {/* STOCK ANALYTICS */}

        <div className="admin-chart-box">

          <div className="box-header">

            <h2>
              Stock Analytics
            </h2>

            <button>
              Today
            </button>

          </div>




          <div className="stock-list">

            {

              foods.slice(0, 6).map(

                (food) => (

                  <div

                    className="stock-item"

                    key={food._id}
                  >

                    <span>
                      {food.name}
                    </span>




                    <span

                      className={

                        food.isAvailable

                        ?

                        "available"

                        :

                        "out"
                      }
                    >

                      {

                        food.isAvailable

                        ?

                        "Available"

                        :

                        "Out"
                      }

                    </span>

                  </div>
                )
              )
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminHome;