import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecommendationPage from "./pages/RecommendationPage";
import SearchResultPage from "./pages/SearchResultPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./pages/Layout";
import PrivateRoute from "./components/PrivateRoute";
// import "./styles/App.css";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<Layout setIsLoggedIn={setIsLoggedIn}/>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/search" element={<SearchResultPage isLoggedIn={isLoggedIn}/>} />
          <Route 
            path="/recommendations" 
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <RecommendationPage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ProfilePage />
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