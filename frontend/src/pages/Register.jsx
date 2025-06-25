import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/main"); 
        }
    }, []);


    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Basic validation
        if (!form.email.includes("@") || form.password.length < 6 || form.username.trim().length < 3) {
            alert("Please enter valid details. Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (res.ok) {
                alert("Registration successful!");
                navigate("/login");
            } else if (res.status === 409) {
                alert("This email is already registered.");
            } else if (!res.ok) {
            alert(data.error || "Registration failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Register</h2>
            <input
                name="username"
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <small>Password must be at least 6 characters</small>

            <button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
            </button>
            <p style={{ marginTop: "1rem" }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </form>
    );
}
