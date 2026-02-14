import React, { useState } from 'react';
import type { User, Room, Message } from '../hooks/useSocket';
import { useTheme } from '../context/ThemeContext';
import { RoomList } from './RoomList';
import { UserList } from './UserList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatContainerProps {
    currentUser: User | null;
    currentRoom: string;
    availableRooms: Room[];
    usersInRoom: User[];
    messages: Message[];
    typingUsers: Set<string>;
    onSwitchRoom: (room: string) => void;
    onSendMessage: (content: string) => void;
    onTyping: (isTyping: boolean) => void;
    onCreateRoom: (roomName: string) => void;
    onLogout: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
    currentUser,
    currentRoom,
    availableRooms,
    usersInRoom,
    messages,
    typingUsers,
    onSwitchRoom,
    onSendMessage,
    onTyping,
    onCreateRoom,
    onLogout
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-72 h-full bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out" onClick={e => e.stopPropagation()}>
                        <RoomList
                            rooms={availableRooms}
                            currentRoom={currentRoom}
                            onSwitchRoom={(room) => {
                                onSwitchRoom(room);
                                setIsMobileMenuOpen(false);
                            }}
                            onCreateRoom={onCreateRoom}
                        />
                    </div>
                </div>
            )}

            {/* Sidebar (Desktop) */}
            <div className="hidden md:block border-r border-slate-200 dark:border-slate-800">
                <RoomList
                    rooms={availableRooms}
                    currentRoom={currentRoom}
                    onSwitchRoom={onSwitchRoom}
                    onCreateRoom={onCreateRoom}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col w-full min-w-0 bg-white dark:bg-slate-950/50 transition-colors duration-300 relative">
                {/* Header */}
                <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between shadow-sm z-20 transition-colors duration-300 absolute top-0 w-full">
                    <div className="flex items-center">
                        <button
                            className="md:hidden mr-3 p-2 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                                <span className="text-purple-500 dark:text-purple-400 mr-1">#</span> {currentRoom}
                            </h1>
                            <p className="text-xs text-slate-400 md:hidden">{usersInRoom.length} online</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                            )}
                        </button>

                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{currentUser?.username}</p>
                            <p className="text-xs text-green-500 dark:text-green-400 flex items-center justify-end gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></span> Online
                            </p>
                        </div>

                        <button
                            onClick={onLogout}
                            className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                            title="Leave Chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <MessageList
                    messages={messages}
                    currentUser={currentUser}
                    typingUsers={typingUsers}
                />

                {/* Floating Typing Indicator */}
                <div className={`absolute bottom-20 left-4 z-30 transition-all duration-300 transform ${typingUsers.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {Array.from(typingUsers).slice(0, 2).join(', ')}
                            {typingUsers.size > 2 ? ` +${typingUsers.size - 2} others` : ''}
                            {typingUsers.size === 1 && ' is typing...'}
                            {typingUsers.size > 1 && ' are typing...'}
                        </span>
                    </div>
                </div>

                {/* Input */}
                <div className="absolute bottom-0 w-full z-20">
                    <MessageInput onSendMessage={onSendMessage} onTyping={onTyping} />
                </div>
            </div>

            {/* User Sidebar (Desktop) */}
            <div className="hidden lg:block border-l border-slate-200 dark:border-slate-800">
                <UserList users={usersInRoom} currentUserId={currentUser?.id || ''} />
            </div>
        </div>
    );
};
