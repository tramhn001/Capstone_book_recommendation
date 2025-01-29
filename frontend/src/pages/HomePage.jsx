import { Link } from "react-router-dom";
import "../styles/global.css";

function HomePage() {
    return (
        <div className="home-container">
            <nav> 
                <Link to="/login" className="home-btn">Login</Link>
                <Link to="/register" className="home-btn">Sign Up</Link>
            </nav>
            <header className="home-header">
                <h1>BookBuddy - Welcome to your next favorite book today</h1>
                <p>Welcome to our vibrant community of book lovers! Dive into insightful reviews and personalized recommendations just for you.</p>
            </header>

            <section className="features">
                
            </section>
        </div>
    );
}

export default HomePage;