/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import axios from "axios";

import socket from "../../socket";

import "../css/AdminNotifications.css";



function AdminNotifications() {

  const [notifications, setNotifications] =
    useState([]);





  // =========================================
  // FETCH NOTIFICATIONS
  // =========================================

  const fetchNotifications =
    async () => {

      try {

        const response =
          await axios.get(

            "http://localhost:5000/api/v1/notifications/admin/admin",

            {
              withCredentials: true
            }
          );



        setNotifications(

          response.data.notifications || []
        );

      } catch (error) {

        console.log(
          "Notification Error:",
          error
        );
      }
    };







  // =========================================
  // SOCKET LIVE NOTIFICATIONS
  // =========================================

  useEffect(() => {

    fetchNotifications();





    socket.on(

      "newOrderPlaced",

      (order) => {

        const newNotification = {

          _id: Date.now(),

          message:
            `🛒 New Order #${order.tokenNumber} placed`,

          createdAt:
            new Date()
        };





        setNotifications(

          (prev) => [

            newNotification,

            ...prev
          ]
        );
      }
    );





    return () => {

      socket.off(
        "newOrderPlaced"
      );
    };

  }, []);







  return (

    <div className="admin-notification-page">

      <div className="notification-header">

        <h1>
          Notifications
        </h1>

        <p>
          Real-time admin alerts
        </p>

      </div>







      <div className="notification-list">

        {

          notifications.length === 0 ? (

            <div className="empty-notification">

              No notifications found

            </div>

          ) : (

            notifications.map(

              (notification) => (

                <div

                  className="notification-card"

                  key={notification._id}
                >

                  <div className="notification-icon">

                    🔔

                  </div>





                  <div className="notification-content">

                    <p>

                      {

                        notification.message
                      }

                    </p>





                    <span>

                      {

                        new Date(

                          notification.createdAt
                        ).toLocaleString()
                      }

                    </span>

                  </div>

                </div>
              )
            )
          )
        }

      </div>

    </div>
  );
}

export default AdminNotifications;