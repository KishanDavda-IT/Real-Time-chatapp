# Real-Time Chat Application

A full-stack chat application that lets users join rooms and exchange messages in real time. It has a responsive interface with light and dark themes.

## Features

- Real-time messaging with Socket.IO
- Create and join chat rooms
- Duplicate-username checks
- Typing indicators
- Persistent light and dark theme preference
- Responsive layout for desktop and mobile

## Tech stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, Socket.IO
- Communication: WebSockets

## Run locally

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/KishanDavda-IT/Real-Time-chatapp.git
cd Real-Time-chatapp
```

Install and start the server in one terminal:

```bash
cd server
npm install
npm run dev
```

Install and start the client in a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local address shown by Vite in your browser.

## Project structure

- `client/` - React application and user interface
- `server/` - Express server and Socket.IO events
