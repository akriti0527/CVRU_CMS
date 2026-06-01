/* eslint-disable react-hooks/set-state-in-effect */
// ======================================
// src/pages/Notifications.jsx
// ======================================

import { useEffect, useState } from "react";

import axios from "axios";

import { io } from "socket.io-client";

import {
  FaBell,
  FaTrash,
  FaCheck
} from "react-icons/fa";

import "../css/Notifications.css";



function Notifications() {

  // ======================================
  // STATES
  // ======================================
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);



  // ======================================
  // SOCKET CONNECTION
  // ======================================
  useEffect(() => {

    const socket =
      io("${import.meta.env.VITE_API_URL}", {

        withCredentials: true,
      });



    // RECEIVE REAL-TIME NOTIFICATION
    socket.on(
      "newNotification",

      (newNotification) => {

        setNotifications((prev) => [

          newNotification,

          ...prev,
        ]);

        // OPTIONAL SOUND
        const audio =
          new Audio(
            "/notification.mp3"
          );

        audio.play();
      }
    );



    return () => {

      socket.disconnect();
    };

  }, []);




  // ======================================
  // FETCH NOTIFICATIONS
  // ======================================
  const fetchNotifications =
  async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(

          "${import.meta.env.VITE_API_URL}/api/v1/notifications/my-notifications",

          {
            withCredentials: true,
          }
        );

      setNotifications(
        response.data.notifications
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message
        || "Failed to fetch notifications"
      );

    } finally {

      setLoading(false);
    }
  };



  // ======================================
  // MARK AS READ
  // ======================================
  const markAsRead = async (id) => {

    try {

      await axios.put(

        `${import.meta.env.VITE_API_URL}/api/v1/notifications/read/${id}`,

        {},

        {
          withCredentials: true,
        }
      );

      setNotifications((prev) =>

        prev.map((notification) =>

          notification._id === id

            ? {
                ...notification,
                isRead: true
              }

            : notification
        )
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to mark as read"
      );
    }
  };



  // ======================================
  // DELETE NOTIFICATION
  // ======================================
  const deleteNotification =
  async (id) => {

    try {

      await axios.delete(

        `${import.meta.env.VITE_API_URL}/api/v1/notifications/delete/${id}`,

        {
          withCredentials: true,
        }
      );

      setNotifications((prev) =>

        prev.filter(
          (notification) =>
            notification._id !== id
        )
      );

    } catch (error) {

      console.log(error);

      alert(
        "Delete failed"
      );
    }
  };



  // ======================================
  // CLEAR ALL NOTIFICATIONS
  // ======================================
  const clearAllNotifications =
  async () => {

    try {

      await axios.delete(

        "${import.meta.env.VITE_API_URL}/api/v1/notifications/clear-all",

        {
          withCredentials: true,
        }
      );

      setNotifications([]);

      alert(
        "All notifications cleared"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to clear notifications"
      );
    }
  };



  // ======================================
  // USE EFFECT
  // ======================================
  useEffect(() => {

    fetchNotifications();

  }, []);




  return (

    <div className="notifications-page">

      {/* HEADER */}
      <div className="notifications-header">

        <h1>

          <FaBell />

          Notifications

        </h1>



        <button
          className="clear-btn"
          onClick={
            clearAllNotifications
          }
        >
          Clear All
        </button>

      </div>



      {/* LOADING */}
      {loading ? (

        <h2>
          Loading Notifications...
        </h2>

      ) : notifications.length === 0 ? (

        <div className="empty-notification">

          <FaBell size={50} />

          <p>
            No Notifications Yet
          </p>

        </div>

      ) : (

        <div className="notification-list">

          {
            notifications.map(
              (notification) => (

                <div

                  key={notification._id}

                  className={
                    notification.isRead

                    ? "notification-card read"

                    : "notification-card unread"
                  }
                >

                  {/* TITLE */}
                  <h3>
                    {notification.title}
                  </h3>



                  {/* MESSAGE */}
                  <p>
                    {notification.message}
                  </p>



                  {/* TIME */}
                  <small>

                    {
                      new Date(
                        notification.createdAt
                      ).toLocaleString()
                    }

                  </small>



                  {/* ACTIONS */}
                  <div className="notification-actions">

                    {
                      !notification.isRead
                      && (

                        <button
                          className="read-btn"
                          onClick={() =>
                            markAsRead(
                              notification._id
                            )
                          }
                        >

                          <FaCheck />

                          Mark Read

                        </button>
                      )
                    }



                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteNotification(
                          notification._id
                        )
                      }
                    >

                      <FaTrash />

                      Delete

                    </button>

                  </div>

                </div>
              )
            )
          }

        </div>
      )}

    </div>
  );
}

export default Notifications;