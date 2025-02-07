import axios from "axios";
import React, { useState } from "react";
import "../styles/SearchResultPage.css";

const SearchResultPage = ({isLoggedIn}) => {
  console.log("Is user logged in?", isLoggedIn);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [finishedDate, setFinishedDate] = useState("");

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

  const openReviewModal = (book) => {
    setSelectedBook(book);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBook(null);
    setReviewText("");
    setRating(0);
    setFinishedDate("");
  };

  const addToReadList = async () => {
    if (!selectedBook) return;
    console.log(selectedBook);
    
    const author = selectedBook.volumeInfo?.authors?.join(", ") || "Unknown Authors";
    const payload = { book_id: selectedBook.id,
                      title: selectedBook.volumeInfo?.title,
                      author: author,
                      rating: rating,
                      review: reviewText,
                      finished_date: finishedDate,
                      thumbnail: selectedBook.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/128x193.png?text=No+Image",
                      genre: selectedBook.volumeInfo?.categories?.join(',') || "Unknown Genres"
    }
    try {
      console.log(payload);
      await axios.post(
        "http://localhost:8000/api/user/lists/read/add/",
        {payload},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );
      alert("Book added to Read List successfully!");
      closeReviewModal();
    } catch (err) {
      console.log(err);
      setError("Failed to add book to Read List. Please try again.");
    }
  };


  const addToWantToReadList = async (book) => {
    const author = book.volumeInfo?.authors?.join(", ") || "Unknown Authors";
    const payload = { book_id: book.id, 
                      title: book.volumeInfo?.title, 
                      author: author,
                      thumbnail: book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/128x193.png?text=No+Image",
                      genre: book.volumeInfo?.categories?.join(',') || "Unknown Genres"
                    }
    console.log(payload);                      
    try {
      await axios.post(
        "http://localhost:8000/api/user/lists/want-to-read/add/",
        {payload},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );
      alert("Book added to Want-to-Read List successfully!");
    } catch (err) {
      console.error(err);
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
          onKeyDown={handleKeyDown}
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
                  <button onClick={(e) => { e.stopPropagation(); openReviewModal(book); }}>Add to Read List</button>
                  <button onClick={() => addToWantToReadList(book)}>Add to Want-to-Read List</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Try searching for a book!</p>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="review-modal">
          <div className="modal-content">
            <h3>Review for {selectedBook?.volumeInfo?.title}</h3>
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
              <option value={0}>Select Rating</option>
              <option value={1}>⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={5}>⭐⭐⭐⭐⭐</option>
            </select>
            <label>Finished Date:</label>
            <input type="date" value={finishedDate} onChange={(e) => setFinishedDate(e.target.value)} />
            <label>Review:</label>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
            <button onClick={(e) => { e.stopPropagation; addToReadList(selectedBook); }}>Submit Review</button>
            <button onClick={closeReviewModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultPage;