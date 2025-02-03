import axios from "axios";
import React, { useState } from "react";
import "../styles/SearchResultPage.css";

const SearchResultPage = ({ isLoggedIn }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery) {
      setError("Please enter a search term.");
      return;
    }
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`      
      );
      setSearchResults(response.data.items || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const addToReadList = async (bookId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/user/lists/read/",
        { book_id: bookId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`},
        }
      );
      alert("Book added to Read List successfully!");
    } catch (err) {
      setError("Failed to add book to Read List. Please try again.");
    }
  };

  const addToWantToReadList = async (bookId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/user/lists/want-to-read/",
        { book_id: bookId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`},
        }
      );
      alert("Book added to Want-to-Read List successfully!");
    } catch (err) {
      setError("Failed to add book to Want-to-Read List. Please try again.");
    }
  };

  return (
    <div className="search-results-container">
      <h2 className="search-header">Search for Books</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter book title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Handle Enter key press
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {searchResults.length > 0 ? (
        <div className="search-results">
          {searchResults.map((book) => (
            <div key={book.id} className="book-item">
              <img 
                src={book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/128x193.png?text=No+Image"}
                alt={book.volumeInfo?.title || "No Cover Available"}
              />
              <div className="book-info">
                <h3>{book.volumeInfo?.title || "Unknown Title"}</h3>
                <p>{book.volumeInfo?.authors?.join(", ") || "Unknown Author"}</p>
                <p>{book.volumeInfo?.publishedDate || "Unknown Date"}</p>
                <p>{book.volumeInfo?.description?.substring(0, 100) || "No Description Available"}</p>
              </div>

              {/* Show buttons only if the user is logged in */}
              {isLoggedIn && (
                <div className="book-actions">
                  <button onClick={() => addToReadList(book.id)}>Add to Read List</button>
                  <button onClick={() => addToWantToReadList(book.id)}>Add to Want-to-Read List</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Try searching for a book!</p>
      )}
    </div>
  );
};

export default SearchResultPage;