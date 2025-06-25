import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";


export default function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        bio: "",
        avatarUrl: "",
        email: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updated, setUpdated] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordUpdated, setPasswordUpdated] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            const user = res.data;
            setProfile({
                name: user.username,
                bio: user.bio || "",
                email: user.email,
                avatarUrl: user.avatarUrl 
                    ? `http://localhost:5000${user.avatarUrl}`
                    : "",
            });
        })
        .catch(err => {
            console.error("Error fetching profile:", err);
        });
    }, []);

    function handleChange(e) {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setUpdated(false);

        const nameTrimmed = profile.name.trim();
        const bioTrimmed = profile.bio.trim();

        // ✅ Validation checks
        if (!nameTrimmed) {
            toast.error("Name is required.");
            setLoading(false);
            return;
        }

        if (bioTrimmed.length > 160) {
            toast.error("Bio must be under 160 characters.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", nameTrimmed);
            formData.append("bio", bioTrimmed);
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const token = localStorage.getItem("token");
            const res = await axios.put("/api/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfile(res.data);
            toast.success("Profile updated successfully!");
            setUpdated(true);
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    }


    <Toaster position="top-right" reverseOrder={false} />

    return (
        <section className="profile-page">
            <div className="profile-card">
                <h2 className="profile-title">Your Profile</h2>

                {updated && <p className="success-msg">✅ Profile updated!</p>}

                <div className="avatar-container">
                    <img
                        src={
                            avatarFile
                                ? URL.createObjectURL(avatarFile)
                                : profile.avatarUrl || "https://i.pravatar.cc/150?img=12"
                        }
                        alt="Avatar"
                        className="avatar"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files[0])}
                        className="file-input"
                    />
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Bio</label>
                    <textarea
                        name="bio"
                        rows="4"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Tell us something about you"
                        
                    />
                    <small>{profile.bio.length}/160 characters</small>

                    <label>Email</label>
                    <input type="email" value={profile.email} disabled />

                    <button type="submit" className="update-btn" disabled={loading}>
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </form>
                {/* <hr style={{ margin: "2rem 0" }} />
                <h3>Change Password</h3>
                {passwordUpdated && <p className="success-msg">✅ Password updated successfully!</p>}
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setPasswordUpdated(false);
                        try {
                        const token = localStorage.getItem("token");
                        const res = await axios.put(
                            "/api/profile/change-password",
                            {
                            oldPassword,
                            newPassword,
                            },
                            {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            }
                        );
                        setOldPassword("");
                        setNewPassword("");
                        setPasswordUpdated(true);
                        } catch (err) {
                        console.error("Password update error:", err);
                        alert(err.response?.data?.error || "Failed to update password.");
                        }
                    }}
                    >
                    <label>Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />

                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="update-btn">Change Password</button>
                </form> */}
            </div>
        </section>
    );
}
