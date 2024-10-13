import React from "react";

import Header from "../Header";
// import NavBar from "./NavBar";
// import Footer from "./Footer";
// import bg from "../assets/Images/bgg.jpg";

import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Analytics } from "@vercel/analytics/react";

function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Analytics />
      <Header />
      <Outlet />
      <ToastContainer />
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
