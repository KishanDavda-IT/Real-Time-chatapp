# Real-time Chat Application

A modern, professional real-time chat application built with **Node.js, Express, Socket.IO, React, and Tailwind CSS**. This app features a sleek "glassmorphism" design, dynamic room creation, and full mobile responsiveness.

## ✨ Features

- **Real-time Messaging**: Instant message delivery powered by Socket.IO.
- **Dynamic Rooms**: Create new chat rooms on the fly or join existing ones.
- **Duplicate Username Check**: Prevents two users from having the same username (case-insensitive).
- **Dark/Light Theme**: A smooth-transition toggle for switching between professional light and dark modes.
- **Premium UI/UX**:
- **Glassmorphism**: Beautiful backdrop blur effects on headers and inputs.
- **Floating Typing Indicators**: Know when others are typing with active bouncing animations.
- **Smooth Transitions**: Global color transitions for a premium feel.
- **Mobile Responsive**: Slide-out drawer menu for rooms and users on smaller screens.
- **Persistent Settings**: Theme preference is saved locally.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Lucide Icons (or SVG based).
- **Backend**: Node.js, Express, Socket.IO.
- **Communication**: WebSockets for real-time bi-directional events.

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/KishanDavda-IT/Real-Time-chatapp.git
cd Real-Time-chatapp
```

2. **Install Backend Dependencies**:
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**:
```bash
cd ../client
npm install
```

### Running the App

1. **Start the Backend Server**:
```bash
# In the /server directory
npm run dev
# Server runs on http://localhost:3001
```

2. **Start the Frontend Development Server**:
```bash
# In the /client directory
npm run dev
# App runs on http://localhost:5173 (or your Vite default)
```

## 📂 Project Structure

- `/server`: Node.js/Express server logic and Socket.IO handlers.
- `/client`: React application with Tailwind CSS.
- `/client/src/components`: UI components (Chat, Message, Room, User lists).
- `/client/src/hooks`: Custom `useSocket` hook for centralizing logic.
- `/client/src/context`: Theme and global state providers.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.
