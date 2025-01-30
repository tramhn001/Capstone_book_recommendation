import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/book-review">Book Review</Link></li>
        <li><Link to="/recommendations">Recommendation</Link></li>
        <li><Link to="/userprofile">Reading List</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;