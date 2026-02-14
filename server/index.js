const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configure Socket.IO with CORS to allow client connections
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

// --- In-Memory Data Store ---
const USERS = new Map(); // socket.id -> { username, room }
const ROOMS = new Map(); // roomName -> { messages: [] }

// Seed default rooms
const DEFAULT_ROOMS = ['General', 'Random', 'Tech'];
DEFAULT_ROOMS.forEach(room => {
  ROOMS.set(room, { messages: [] });
});

// Helper: Get active users in a specific room
function getUsersInRoom(roomName) {
  const users = [];
  USERS.forEach((user, socketId) => {
    if (user.room === roomName) {
      users.push({ id: socketId, username: user.username });
    }
  });
  return users;
}

// Helper: Get list of rooms with user counts
function getRoomList() {
  const roomList = [];
  ROOMS.forEach((data, name) => {
    const count = getUsersInRoom(name).length;
    roomList.push({ name, count });
  });
  return roomList;
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // 1. User Joins (Login) - automatically joins "General" initially
  socket.on('user:join', (username) => {
    // Basic validation
    if (!username || typeof username !== 'string') return;

    // Check for duplicate username (case-insensitive)
    const isDuplicate = Array.from(USERS.values()).some(
      u => u.username.toLowerCase() === username.toLowerCase()
    );

    if (isDuplicate) {
      socket.emit('join:error', 'Username already taken');
      return;
    }

    // Store user data
    const initialRoom = 'General';
    USERS.set(socket.id, { username, room: initialRoom });

    // Join the socket room
    socket.join(initialRoom);

    // Broadcast to the room that user joined
    io.to(initialRoom).emit('user:joined', { username, id: socket.id });

    // Send success to the user with initial data
    socket.emit('join:success', {
      username,
      room: initialRoom,
      messages: ROOMS.get(initialRoom).messages,
      users: getUsersInRoom(initialRoom),
      availableRooms: getRoomList()
    });

    // Update everyone's room list (user counts changed)
    io.emit('rooms:list', getRoomList());

    // Update user list for the room
    io.to(initialRoom).emit('room:users', getUsersInRoom(initialRoom));

    console.log(`${username} joined ${initialRoom}`);
  });

  // 2. Switch Room
  socket.on('room:join', (newRoomName) => {
    const user = USERS.get(socket.id);
    if (!user) return; // Not logged in

    const oldRoom = user.room;

    // Update user record
    user.room = newRoomName;
    USERS.set(socket.id, user);

    // Socket leave old, join new
    socket.leave(oldRoom);
    socket.join(newRoomName);

    // Initialize room if it doesn't exist (dynamic rooms)
    if (!ROOMS.has(newRoomName)) {
      ROOMS.set(newRoomName, { messages: [] });
    }

    // Notify old room
    socket.to(oldRoom).emit('user:left', { username: user.username, id: socket.id });
    io.to(oldRoom).emit('room:users', getUsersInRoom(oldRoom));

    // Notify new room
    io.to(newRoomName).emit('user:joined', { username: user.username, id: socket.id });
    io.to(newRoomName).emit('room:users', getUsersInRoom(newRoomName));

    // Send history of new room to user
    socket.emit('message:history', ROOMS.get(newRoomName).messages);

    // Update global room list counts
    io.emit('rooms:list', getRoomList());

    console.log(`${user.username} moved: ${oldRoom} -> ${newRoomName}`);
  });

  // 3. Send Message
  socket.on('message:send', (content) => {
    const user = USERS.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      senderId: socket.id,
      senderName: user.username,
      content,
      timestamp: new Date().toISOString(),
      type: 'text' // 'text' | 'system'
    };

    // Save to history
    const roomData = ROOMS.get(user.room);
    if (roomData) {
      roomData.messages.push(message);
      // Keep last 100
      if (roomData.messages.length > 100) {
        roomData.messages.shift();
      }
    }

    // Broadcast to room
    io.to(user.room).emit('message:receive', message);
  });

  // 4. Typing Indicators
  socket.on('typing:start', () => {
    const user = USERS.get(socket.id);
    if (user) {
      socket.to(user.room).emit('typing:update', { username: user.username, isTyping: true });
    }
  });

  socket.on('typing:stop', () => {
    const user = USERS.get(socket.id);
    if (user) {
      socket.to(user.room).emit('typing:update', { username: user.username, isTyping: false });
    }
  });

  // 5. Create Room
  socket.on('room:create', (roomName) => {
    const user = USERS.get(socket.id);
    if (!user) return;

    if (!roomName || typeof roomName !== 'string' || !roomName.trim()) return;

    const trimmedRoomName = roomName.trim();

    if (ROOMS.has(trimmedRoomName)) {
      // Room already exists, just join it? Or maybe notify?
      // For now, let's just ignore or maybe auto-join.
      // Let's treat it as a switch room request if it exists, or just do nothing and let the user switch.
      return;
    }

    ROOMS.set(trimmedRoomName, { messages: [] });

    // Broadcast new room list to everyone
    io.emit('rooms:list', getRoomList());
  });

  // 6. Disconnect
  socket.on('disconnect', () => {
    const user = USERS.get(socket.id);
    if (user) {
      const room = user.room;
      // Remove from store
      USERS.delete(socket.id);

      // Notify room
      io.to(room).emit('user:left', { username: user.username, id: socket.id });
      io.to(room).emit('room:users', getUsersInRoom(room));

      // Update global room list
      io.emit('rooms:list', getRoomList());

      console.log(`User disconnected: ${user.username}`);
    } else {
      console.log(`Socket disconnected: ${socket.id}`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING on port ${PORT}`);
});
