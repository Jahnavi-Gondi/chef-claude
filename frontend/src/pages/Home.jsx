import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to Chef Claude</h1>
                <p>Your smart recipe assistant. Start cooking with the ingredients you have.</p>
                <div className="home-buttons">
                    <button onClick={() => navigate("/login")}>Login</button>
                    <button onClick={() => navigate("/register")}>Register</button>
                </div>
            </div>
        </div>
    );
}
