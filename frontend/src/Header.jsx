import { NavLink, useNavigate, useLocation } from "react-router-dom";
import chefClaudeLogo from "./assets/kitchen-set-solid.svg";
import { FaUserCircle } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const isWelcomePage = location.pathname === "/";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    function toggleDropdown() {
        setDropdownOpen(prev => !prev);
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="logo">
                <img src={chefClaudeLogo} alt="Chef Claude Logo" />
                <h1>Chef Claude</h1>
            </div>

            {!isWelcomePage && token ? (
                <div className="nav-actions">
                    <nav className="nav-links">
                        <NavLink to="/main" className={({ isActive }) => isActive ? "active" : ""}>
                            Home
                        </NavLink>
                        <NavLink to="/saved" className={({ isActive }) => isActive ? "active" : ""}>
                            Saved Recipes
                        </NavLink>
                    </nav>

                    <div className="user-dropdown" ref={dropdownRef}>
                        <FaUserCircle
                            size={28}
                            color="#444"
                            className="profile-icon"
                            onClick={toggleDropdown}
                        />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={() => { navigate("/profile"); setDropdownOpen(false); }}>
                                    View Profile
                                </button>
                                <button onClick={() => navigate("/change-password")}>Change Password</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <nav className="nav-links">
                    <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
                        Login
                    </NavLink>
                    <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>
                        Register
                    </NavLink>
                </nav>
            )}
        </header>
    );
}
