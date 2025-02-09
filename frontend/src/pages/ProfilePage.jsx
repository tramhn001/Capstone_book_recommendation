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

  const removeBookFromList = async (bookId, listType) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove this book from ${listType === "read" ? "Read" : "Want-to-Read"} list?`);
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:8000/api/user/lists/${listType}/remove/${bookId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
      );

      alert("Book removed successfully!");
      fetchUserLists(); // Refresh the list after deletion

    } catch (err) {
      setError("Failed to remove book. Please try again.");
    }
  };

  return (
		<div className="profile-page-container">
			<h1>Your Reading Journey</h1>
			{error && <p className="error-message">{error}</p>}

			{/* Read List */}
			<div className="read-list">
				<h2>Read List</h2>
				{readList.length > 0 ? (
					<ul className="book-list">
						{readList.map((book) => (
							<li key={book.book_id}>
								<img
								src={book.thumbnail || "https://via.placeholder.com/128x193.png?text=No+Image"}
								alt={book.title || "No Cover Available"}>									
								</img>
								<h3>{book.title}</h3>
								<p>{book.author}</p>
								
								{/* Star Rating */}
								<div className="book-rating">
									{Array.from({ length: book.rating }).map((_, index) => (
										<span key={index} className="star filled">★</span>
									))}
									{Array.from({ length: 5 - book.rating }).map((_, index) => (
										<span key={index} className="star empty">★</span>
									))}
								</div>
								<p>{book.review}</p>
								<p>{book.finished_at}</p>

                {/* Remove Book Button  */}
                <button className="remove-button" onClick={() => removeBookFromList(book.book_id, "read")}>Remove</button>
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
					<ul className="book-list">
						{wantToReadList.map((book) => (
							<li key={book.book_id}> 
								<img
								src={book.thumbnail || "https://via.placeholder.com/128x193.png?text=No+Image"}
								alt={book.title || "No Cover Available"}>									
								</img>
								<h3>{book.title}</h3>
								<p>{book.author}</p>	
                {/* Remove Book Button  */}
                <button className="remove-button" onClick={() => removeBookFromList(book.book_id, "want-to-read")}>Remove</button>
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