import React, { useState } from 'react';
import type { Room } from '../hooks/useSocket';

interface RoomListProps {
    rooms: Room[];
    currentRoom: string;
    onSwitchRoom: (room: string) => void;
    onCreateRoom: (roomName: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ rooms, currentRoom, onSwitchRoom, onCreateRoom }) => {
    const [newRoomName, setNewRoomName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRoomName.trim()) {
            onCreateRoom(newRoomName.trim());
            setNewRoomName('');
            setIsCreating(false);
            onSwitchRoom(newRoomName.trim());
        }
    };

    return (
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-wide">
                    <span className="text-purple-500 dark:text-purple-400">#</span> Rooms
                </h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                    title="Create Room"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform duration-200 ${isCreating ? 'rotate-45' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {isCreating && (
                    <form onSubmit={handleCreateRoom} className="mb-4 animate-fade-in">
                        <input
                            type="text"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            placeholder="Room name..."
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!newRoomName.trim()}
                            className="w-full py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Create
                        </button>
                    </form>
                )}

                {rooms.map((room) => (
                    <button
                        key={room.name}
                        onClick={() => onSwitchRoom(room.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${currentRoom === room.name
                            ? 'bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 shadow-sm border border-purple-200 dark:border-purple-500/30'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        <div className="flex items-center space-x-3 bg-transparent">
                            <span className={`text-lg ${currentRoom === room.name ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400'}`}>#</span>
                            <span className="font-medium truncate max-w-[120px] text-left">{room.name}</span>
                        </div>
                        {room.count > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${currentRoom === room.name
                                ? 'bg-purple-200 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}>
                                {room.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
