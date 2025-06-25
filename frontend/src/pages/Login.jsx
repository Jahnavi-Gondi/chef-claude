import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
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

        // client-side validation
        if (!form.email || !form.password) {
            alert("Email and password are required.");
            return;
        }
        if (!form.email.includes("@") || form.password.length < 6) {
            alert("Please enter a valid email and password (min 6 chars).");
            return;
        }


        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem("token", data.token); 
                alert("Logged in successfully!");
                navigate("/main"); 
            } else {
                alert(data.error || "Login failed.");
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
            <h2>Login</h2>
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
            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
            </button>
            <p style={{ marginTop: "1rem" }}>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </form>
    );
}
