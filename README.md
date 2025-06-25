# 👨‍🍳 Chef Claude

**Chef Claude** is a fullstack AI-powered recipe generator app that allows users to input available ingredients and receive curated recipes using an AI model. Users can register, log in, manage their profile (including avatars), generate recipes, and save favorites.

---

## 🚀 Features

- 🔐 User Authentication with JWT
- 📝 Ingredient input & dynamic list
- 🤖 AI recipe generation (Mistral API)
- 💾 Save & view favorite recipes
- ✂️ Remove unwanted ingredients before generating
- 🧑‍💼 Profile page with editable avatar and user info
- 🔒 Change password securely
- ☁️ MongoDB Atlas integration (cloud DB)

---

## 🖼️ Demo

> Live demo coming soon after deployment.

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Vanilla CSS
- React Router
- Toast notifications

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Multer (file upload)
- JWT for authentication
- dotenv for config

---

## 📁 Folder Structure

chef-claude/
│
├── frontend/ # React app
│ └── src/
│ ├── components/
│ ├── pages/
│ └── App.jsx, index.jsx, etc.
│
├── backend/ # Node.js + Express server
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── server.js
│
└── uploads/
# Profile picture uploads



---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Jahnavi-Gondi/chef-claude.git
cd chef-claude
2. Install Dependencies
Frontend:
bash

cd frontend
npm install
Backend:
bash

cd ../backend
npm install
3. Configure Environment Variables
Create a .env file inside the backend/ directory:

env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
HF_API_KEY=your_huggingface_access_token

4. Run the App
Backend:
bash

cd backend
npm start
Frontend:
bash

cd ../frontend
npm run dev
🔮 Future Enhancements
Recipe rating and comments

Autocomplete ingredient suggestions

AI-based fridge image recognition

Public recipe sharing and print options

📸 Screenshots
(To be added after deployment)

🤝 Contributing
Pull requests are welcome! For major changes, open an issue to discuss what you’d like to change.

📄 License
MIT License

👩‍💻 Author
Jahnavi Gondi

