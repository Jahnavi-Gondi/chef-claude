import React, { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const toggleOld = () => setShowOld(!showOld);
    const toggleNew = () => setShowNew(!showNew);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Client-side validations
        if (!oldPassword || !newPassword) {
            return setError("Both fields are required.");
        }
        if (newPassword.length < 6) {
            return setError("New password must be at least 6 characters.");
        }
        if (oldPassword === newPassword) {
            return setError("New password must be different from the old one.");
        }

        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "/api/profile/change-password",
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess("Password updated successfully.");
            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            console.error(err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to update password.");
        }
    }

    return (
        <section className="change-password-page">
            <div className="form-container">
                <h2>Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <label>Old Password</label>
                    <div className="input-with-toggle">
                        <input
                            type={showOld ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={toggleOld}
                            className="toggle-btn"
                        >
                            {showOld ? "Hide" : "Show"}
                        </button>
                    </div>

                    <label>New Password</label>
                    <div className="input-with-toggle">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={toggleNew}
                            className="toggle-btn"
                        >
                            {showNew ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button type="submit">Change Password</button>
                    {success && <p className="success-msg">{success}</p>}
                    {error && <p className="error-msg">{error}</p>}
                </form>
            </div>
        </section>
    );
}
