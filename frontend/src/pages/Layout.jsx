import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Layout.css";  

const Layout = ({ setIsLoggedIn }) => {
  return (  
    <div className="app">
      <Navbar setIsLoggedIn={setIsLoggedIn}/>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;