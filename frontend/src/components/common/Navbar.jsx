import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import BookBuddy_Logo from "../../assets/images/BookBuddy_Logo.png";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={BookBuddy_Logo} alt="Book Buddy Logo" />
        </Link>
      </div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/book-review">Book Review</Link></li>
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
      {!isLoggedIn && <Link className="login-link" to="/login">Login</Link>}
    </nav>
  );
};

export default Navbar;