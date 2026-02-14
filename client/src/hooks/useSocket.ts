import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';

export interface User {
    id: string;
    username: string;
    room?: string;
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    type: 'text' | 'system';
}

export interface Room {
    name: string;
    count: number;
}

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

    // Refs for callbacks to avoid dependency cycles
    const messageListRef = useRef<Message[]>([]);

    useEffect(() => {
        const newSocket = io(SERVER_URL, {
            autoConnect: false // Connect manually after login if desired, or auto
        });

        newSocket.connect();
        setSocket(newSocket);

        // Connection events
        newSocket.on('connect', () => setIsConnected(true));
        newSocket.on('disconnect', () => setIsConnected(false));

        // Cleanup
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        // --- Event Listeners ---

        socket.on('join:error', (err: string) => {
            setError(err);
        });

        socket.on('join:success', (data: { username: string; room: string; messages: Message[]; users: User[]; availableRooms: Room[] }) => {
            setCurrentUser({ id: socket.id!, username: data.username, room: data.room });
            setMessages(data.messages);
            messageListRef.current = data.messages;
            setUsersInRoom(data.users);
            setAvailableRooms(data.availableRooms);
            setError(null);
        });

        socket.on('rooms:list', (rooms: Room[]) => {
            setAvailableRooms(rooms);
        });

        socket.on('room:users', (users: User[]) => {
            setUsersInRoom(users);
        });

        socket.on('message:receive', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on('message:history', (history: Message[]) => {
            setMessages(history);
        });

        socket.on('user:joined', (_user: { username: string; id: string }) => {
            // Optional: Add system message?
            // const sysMsg: Message = { ...type: 'system'... }
        });

        socket.on('user:left', (_user: { username: string; id: string }) => {
            // Optional: Add system message?
        });

        socket.on('typing:update', ({ username, isTyping }: { username: string; isTyping: boolean }) => {
            setTypingUsers((prev) => {
                const newSet = new Set(prev);
                if (isTyping) newSet.add(username);
                else newSet.delete(username);
                return newSet;
            });
        });

        return () => {
            socket.off('join:success');
            socket.off('rooms:list');
            socket.off('room:users');
            socket.off('message:receive');
            socket.off('message:history');
            socket.off('user:joined');
            socket.off('user:left');
            socket.off('typing:update');
            socket.off('join:error');
        };
    }, [socket]);

    // --- Actions ---

    const joinGame = (username: string) => {
        if (socket) {
            socket.emit('user:join', username);
            // Reset error when attempting to join
            setError(null);
        }
    };

    const switchRoom = (roomName: string) => {
        if (socket && currentUser) {
            socket.emit('room:join', roomName);
            setCurrentUser({ ...currentUser, room: roomName });
        }
    };

    const sendMessage = (content: string) => {
        if (socket) socket.emit('message:send', content);
    };

    const setTyping = (isTyping: boolean) => {
        if (socket) socket.emit(isTyping ? 'typing:start' : 'typing:stop');
    };

    const createRoom = (roomName: string) => {
        if (socket) socket.emit('room:create', roomName);
    };

    const logout = () => {
        if (socket) {
            socket.disconnect();
            // Reconnect for next login attempt
            socket.connect();
        }
        setCurrentUser(null);
        setMessages([]);
        setUsersInRoom([]);
        setError(null);
    };

    return {
        socket,
        isConnected,
        error,
        currentUser,
        availableRooms,
        usersInRoom,
        messages,
        typingUsers,
        actions: {
            joinGame,
            switchRoom,
            sendMessage,
            setTyping,
            createRoom,
            logout
        }
    };
};
