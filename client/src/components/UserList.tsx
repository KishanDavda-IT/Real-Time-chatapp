import React from 'react';
import type { User } from '../hooks/useSocket';

interface UserListProps {
    users: User[];
    currentUserId: string;
}

export const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
    return (
        <div className="w-60 bg-white dark:bg-slate-800/30 backdrop-blur-md border-l border-slate-200 dark:border-slate-700 hidden lg:flex flex-col h-full transition-colors duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Online — {users.length}
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                {user.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-sm font-medium ${user.id === currentUserId ? 'text-purple-600 dark:text-purple-300' : 'text-slate-700 dark:text-slate-200'}`}>
                                {user.username} {user.id === currentUserId && '(You)'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
