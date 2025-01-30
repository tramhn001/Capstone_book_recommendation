import React, { useState } from "react";
import axios from "axios";
import "../styles/SearchResultPage.css";

const SearchResultPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`);
      setSearchResults(response.data.items || []);
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSearch(); // Trigger search on Enter key
      }
    };

  return (
    <div className="search-page-container">
      <div className="search-header">
        <h1>Book Search</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for books"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((book) => (
            <div className="book-item" key={book.id}>
              <img
                src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x193"}
                alt={book.volumeInfo.title}
              />
              <div className="book-info">
                <h3>{book.volumeInfo.title}</h3>
                <p>{book.volumeInfo.authors?.join(", ")}</p>
                <p>{book.volumeInfo.publishedDate}</p>
                <p>{book.volumeInfo.description?.substring(0, 150)}...</p>
              </div>
            </div>
          ))
        ) : (
          <div className="default-message">  
            <h3>Easy search for your next read</h3>
            <p>Find books by title, genre, author effortlessly</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;