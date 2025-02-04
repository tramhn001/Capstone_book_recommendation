import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";


const ProfilePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [readList, setReadList] = useState([]);
  const [wantToReadList, setWantToReadList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user lists on component mount
  useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			navigate("/login");
		} else {
			fetchUserLists();
		}
  }, [navigate]);

  // Fetch user's Read List and Want-to-Read List
  const fetchUserLists = async () => {
		try {
			const response = await axios.get("http://localhost:8000/api/user/lists/", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});
			console.log(response.data)
			setReadList(response.data.read_list);
			setWantToReadList(response.data.want_to_read_list);			
	} catch (err) {
			console.log(err);
			setError("Failed to fetch lists. Please try again.");
		}
  };

  // Handle book search
  const handleSearch = async () => {
		if (!searchQuery) {
			setError("Please enter a search term.");
			return;
		}

		try {
			const response = await axios.get(`http://localhost:8000/api/books/search?query=${searchQuery}`);
			console.log(response.data);
			setSearchResults(response.data);
		} catch (err) {
			setError("Failed to fetch search results. Please try again.");
		}
  };

  return (
		<div className="profile-page-container">
			<h1>Profile Page</h1>
			{error && <p className="error-message">{error}</p>}

			
			{/* Search Bar */}
			<div className="search-bar">
				<input
					type="text"
					placeholder="Search for books..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<button onClick={handleSearch}>Search</button>
			</div>

			{/* Search Results */}
			{/* <SearchResults
				results={searchResults}
				isLoggedIn={true} // User is logged in
				onAddToReadList={addToReadList}
				onAddToWantToReadList={addToWantToReadList}
			/> */}

			{/* Read List */}
			<div className="read-list">
				<h2>Read List</h2>
				{readList.length > 0 ? (
					<ul>
						{readList.map((book) => (
							<li key={book.book_id}>
								<h3>{book.title}</h3>
								<p>{book.author}</p>
							</li>
						))}
					</ul>
				) : (
					<p>Your Read List is empty.</p>
				)}
			</div>

			{/* Want-to-Read List */}
			<div className="want-to-read-list">
				<h2>Want-to-Read List</h2>
				{wantToReadList.length > 0 ? (
					<ul>
						{wantToReadList.map((book) => (
							<li key={book.book_id} display="inline"> 
								<img
								src={book.thumbnail || "https://via.placeholder.com/128x193.png?text=No+Image"}
								alt={book.title || "No Cover Available"}>									
								</img>
								<h3>{book.title}</h3>
								<p>{book.author}</p>	
								
							</li>							
						))}
					</ul>
				) : (
					<p>Your Want-to-Read List is empty.</p>
				)}
			</div>
		</div>
  );
};

export default ProfilePage;