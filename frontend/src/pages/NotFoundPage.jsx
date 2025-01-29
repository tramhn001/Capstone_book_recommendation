import React from "react";
import bookGif from "../assets/images/book-animation.gif";
import "./NotFoundPage.css";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="not-found-page"> 
      <h1>404 - Page is not found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <img 
        src={bookGif}
        alt="Book animation"
        className="book-animation"
      />
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default NotFoundPage;