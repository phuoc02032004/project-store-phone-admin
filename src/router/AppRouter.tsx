import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MainLayout from "@/components/layouts/MainLayout";
import Category from "@/pages/Category";
import Coupon from "@/pages/Coupon";
import Notifications from "@/pages/Notification";
import Order from "@/pages/Order";
import Product from "@/pages/Product";
import User from "@/pages/User";
import Settings from "@/pages/Settings";
import Reviews from "@/pages/Reviews";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="category" element={<Category />} />
          <Route path="coupon" element={<Coupon />} />
          <Route path="notification" element={<Notifications />} />
          <Route path="order" element={<Order />} />
          <Route path="product" element={<Product />} />
          <Route path="user" element={<User />} />
          <Route path="settings" element={<Settings />} />
          <Route path="review" element={<Reviews />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;