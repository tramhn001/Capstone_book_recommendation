import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar"; // Import Navbar component
import "../styles/global.css"; // Ensure your global styles are imported
import "../styles/Homepage.css"; // Import your homepage-specific styles

const HomePage = () => {
    return (
        <div className="container">
            {/* Navbar at the top-left */}
            <Navbar />

            {/* Login & SignUp Buttons at the top-right */}
            <div className="top-right-buttons">
                <Link to="/login" className="home-btn">Login</Link>
                <Link to="/register" className="home-btn">Sign Up</Link>
            </div>

            {/* Main Header */}
            <header className="home-header">
                <h1>BookBuddy - Welcome to your next favorite book today</h1>
                <p>Welcome to our vibrant community of book lovers! Dive into insightful reviews and personalized recommendations just for you.</p>
            </header>

            <section className="features">
                {/* Future features can go here */}
            </section>
        </div>
    );
};

export default HomePage;