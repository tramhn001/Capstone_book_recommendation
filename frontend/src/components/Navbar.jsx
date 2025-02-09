import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import Logo3 from "../assets/Logo3.png";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={Logo3} alt="Book Buddy Logo" />
      </div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/recommendations">Recommendation</Link></li>
        <li><Link to="/profile">Reading List</Link></li>
      </ul>
      
      <div className="navbar-right">
        {isLoggedIn && (
          <div className="user-menu" onClick={() => setShowDropdown(!showDropdown)}>
            <FaUserCircle className="user-icon" />
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>      
    </nav>
  );
};

export default Navbar;