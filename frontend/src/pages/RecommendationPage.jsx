
import React, { useState } from "react";
import "../styles/RecommendationPage.css";
import axios from "axios";

const RecommendationPage = ({ isLoggedIn }) => {
  const [recommendationByGenre, setRecommendationByGenre] = useState(null);
  const [recommendationByAuthor, setRecommendationByAuthor] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError("");

    try {
      const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
      const response_rec_genre = await axios.get(
        `${backendURL}/api/user/lists/recommendations/genre/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const response_rec_author = await axios.get(
        `${backendURL}/api/user/lists/recommendations/author/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setRecommendationByGenre(response_rec_genre.data.recommendations_by_genre || {});
      setRecommendationByAuthor(response_rec_author.data.recommendations_by_author || {});
    } catch (err) {
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recommendation-page">
      <h2>Book Recommendations</h2>
      <p>Discover books based on your favorite genres and authors!</p>

      <div className="buttons">
        <button onClick={fetchRecommendations} disabled={isLoading}>
          {isLoading ? "Loading..." : "Get Recommendations"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="recommendation-container">
        {/* Recommendations by Genre */}
        <div className="recommendation-list">
          <h3>Recommended Books by Genre</h3>
          {recommendationByGenre && Object.keys(recommendationByGenre).length > 0 ? (
            Object.entries(recommendationByGenre).map(([genre, books]) => (
              <div key={genre} className="genre-section">
                <h4>{genre}</h4>
                <div className="book-list">
                  {books.map((book) => (
                    <div key={book.id} className="book-item">
                      <img src={book.thumbnail} alt={book.title} className="book-cover" />
                      <div className="book-info">
                        <h4>{book.title}</h4>
                        <p>by {book.authors}</p>
                        <p>{book.publishedDate || "Unknown Date"}</p>
                        <p>{book.description?.substring(0, 100) || "No Description Available"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>Click ‘Get Recommendations’ to discover personalized book suggestions based on your favorite genres!</p>
          )}
        </div>

        {/* Recommendations by Author */}
        <div className="recommendation-list">
          <h3>Recommended Books by Author</h3>
          {recommendationByAuthor && Object.keys(recommendationByAuthor).length > 0 ? (
            Object.entries(recommendationByAuthor).map(([author, books]) => (
              <div key={author} className="author-section">
                <h4>{author}</h4>
                <div className="book-list">
                  {books.map((book) => (
                    <div key={book.id} className="book-item">
                      <img src={book.thumbnail} alt={book.title} className="book-cover" />
                      <div className="book-info">
                        <h4>{book.title}</h4>
                        <p>by {book.authors}</p>
                        <p>{book.publishedDate || "Unknown Date"}</p>
                        <p>{book.description?.substring(0, 100) || "No Description Available"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>Explore books curated just for you—get recommendations based on your favorite authors!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
