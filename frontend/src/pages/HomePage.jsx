import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css"; 
// import "../styles/HomePage.css"; 
import bookCovers from "../assets/bookCovers"; 

const shuffleArray = (array) => {
	return array.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
};

const HomePage = () => {
	const isLoggedIn = !!localStorage.getItem("accessToken");

	const shuffleBooks = shuffleArray(bookCovers);
	const columns = Array.from( {length: 5}, (_, colIndex) => 
		shuffleBooks.filter((_, index) => index % 5 === colIndex)
	);

	return (
		<div className="home-container">
			<div className="background-columns">
				{columns.map((column, colIndex) => (
					<div key={colIndex} className={`image-column col-${colIndex}`}>
						{column.map((book, index) => (
							<img key={index} src={book} alt={`Book cover ${index}`} />
						))}
					</div>
				))}
			</div>

			{!isLoggedIn && (
							<div className="top-right-buttons">
									<Link to="/login" className="home-btn">Login</Link>
									<Link to="/register" className="home-btn">Sign Up</Link>
							</div>
					)
					}   

			{/* Main Header */}
			<header className="home-header">
					<h1>BookBuddy - Welcome to your next favorite book today</h1>
					<p>Welcome to our lively haven for book lovers! Track your reading journey, explore personalized recommendations, and fall in love with your next great read.</p>
			</header>
		</div>
	);
};

export default HomePage;