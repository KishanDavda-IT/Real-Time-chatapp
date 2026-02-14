import React, { useState } from 'react';

interface LoginFormProps {
    onJoin: (username: string) => void;
    error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onJoin, error: serverError }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Username is required');
            return;
        }
        onJoin(username);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-fade-in">
            <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <h2 className="text-3xl font-bold text-center mb-2 text-slate-800 dark:text-white">
                    Join Chat
                </h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Enter your username to start messaging</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError('');
                            }}
                            className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="e.g. Captain Nemo"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        {serverError && <p className="text-red-500 text-sm mt-1">{serverError}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25"
                    >
                        Enter Chat Room
                    </button>
                </form>
            </div>
        </div>
    );
};
