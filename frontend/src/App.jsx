import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecommendationPage from "./pages/RecommendationPage";
import SearchResultPage from "./pages/SearchResultPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./pages/Layout";
import PrivateRoute from "./components/common/PrivateRoute";
// import "./styles/App.css";

const kbaseURL = import.meta.env.VITE_APP_BACKEND_URL;
// const apiKey = process.env.GOOGLE_BOOK_API_KEY

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/recommendation" 
            element={
              <PrivateRoute>
                <RecommendationPage />
              </PrivateRoute>
            }
          />
          <Route path="/search" element={<SearchResultPage />} />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <UserProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;