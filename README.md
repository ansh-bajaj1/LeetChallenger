# 🚀 LeetChallenger

LeetChallenger is a full-stack competitive coding platform that transforms individual coding practice into an engaging challenge experience. Users can create coding competitions, invite participants, compare LeetCode profiles, track progress, and compete on dynamic leaderboards powered by real-time coding statistics.

## 🌟 Features

* 🔐 Secure User Authentication
* 👤 User Profiles & Dashboard
* 🏆 Challenge Creation & Management
* 📊 Dynamic Leaderboards
* 📈 LeetCode Profile Comparison
* 🎯 Progress Tracking
* 👥 Challenge Participation System
* 📱 Responsive UI for Desktop & Mobile
* ⚡ Real-Time Ranking Updates

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Tokens)
* bcrypt

### Deployment

* Vercel (Frontend)
* Render (Backend)

## 🏗️ System Architecture

```text
React Frontend
      │
      ▼
Node.js + Express API
      │
      ▼
    MongoDB
      │
      ▼
LeetCode Data Integration
```

## ✨ Core Functionalities

### Challenge Management

* Create coding challenges
* Join active challenges
* Track participant progress
* View rankings and standings

### User Dashboard

* Profile overview
* Challenge history
* Performance analytics
* Participation statistics

### Leaderboards

* Real-time ranking updates
* Participant comparisons
* Challenge-based scoring

## 📂 Project Structure

```text
LeetChallenger
│
├── frontend
│   ├── src
│   ├── public
│   └── components
│
├── backend
│   ├── routes
│   ├── controllers
│   ├── middleware
│   ├── models
│   └── config
│
└── database
```

## 🚀 Getting Started

### Prerequisites

* Node.js
* MongoDB
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/LeetChallenger.git
```

Navigate to project directory:

```bash
cd LeetChallenger
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

Create a `.env` file and configure:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm start
```

Start frontend:

```bash
npm run dev
```

## 🎯 Use Case

LeetChallenger helps students, coding enthusiasts, and competitive programmers stay consistent with problem-solving by introducing competition, accountability, and progress tracking into their coding journey.

## 🔮 Future Enhancements

* Friend System
* Notifications
* Contest Recommendations
* Advanced Analytics
* Achievement Badges
* Organization Challenges

## 👨‍💻 Author

**Ansh Bajaj**

Computer Science Engineering Student | Full-Stack Developer | Competitive Programmer

## 📄 License

This project is licensed under the MIT License.
