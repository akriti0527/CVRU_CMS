/* eslint-disable no-undef */
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ AUTH
import AuthPage from "./auth/AuthPage";

// ✅ USER
import UserDashboard from "./pages/UserDashBoard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
// eslint-disable-next-line no-unused-vars
import Notifications from "./pages/Notifications"
import AddItem from "./admin/pages/AddItem";
// ✅ 🔥 ADD THESE
import Payment from "./pages/Payment";
import Token from "./pages/Token";
import UserSettings from "./pages/UserSettings";
// ✅ ADMIN
import AdminLayout from "./admin/pages/AdminLayout";
import AdminMenu from "./admin/pages/AdminMenu";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminHome from "./admin/pages/AdminHome";
import AdminStocks from "./admin/pages/AdminStocks";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminNotifications
from "./admin/pages/AdminNotifications";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ AUTH PAGE */}
        <Route path="/" element={<AuthPage />} />
        {/* ✅ USER SIDE */}
        <Route path="/home" element={<UserDashboard />} />
        { <Route path="/login" element={<Login />} /> }
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Orders />} />
         <Route path="/settings" element={<UserSettings />} />
         {/* NOTIFICATIONS */}
        <Route
          path="/notifications"
          element={<Notifications />}/>
          <Route

  path="/admin/notifications"

  element={<AdminNotifications />}

/>
        {/* 🔥 ADD THESE ROUTES */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/token" element={<Token />} />

        {/* ✅ ADMIN PANEL */}
        {/* ✅ ADMIN PANEL */}
       
        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
<Route
  path="/admin/add-item"
  element={<AddItem />}
/>
          <Route index element={<AdminHome />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="orders" element={<AdminOrders />} />

        </Route>
        <Route path="admin/stocks" element={<AdminStocks />} />

          {/*  FIXED */}
          <Route

  path="/admin/settings"

  element={<AdminSettings />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;