import React, { useState, useRef } from 'react';

interface MessageInputProps {
    onSendMessage: (content: string) => void;
    onTyping: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onTyping }) => {
    const [message, setMessage] = useState('');
    const typingTimeoutRef = useRef<number | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        // Typing indicator logic
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        onTyping(true);

        typingTimeoutRef.current = setTimeout(() => {
            onTyping(false);
        }, 2000) as unknown as number; // 2 seconds after last keystroke
    };

    const handleSend = () => {
        if (!message.trim()) return;

        onSendMessage(message);
        setMessage('');
        onTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };

    return (
        <div className="p-4 bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl border-t border-white/20 dark:border-slate-800/50 transition-all duration-300">
            <div className="flex items-end space-x-2 bg-white/40 dark:bg-slate-800/40 rounded-3xl p-2 border border-white/20 dark:border-slate-700/30 shadow-lg ring-0 outline-none hover:bg-white/50 dark:hover:bg-slate-800/60 transition-all duration-300">
                <textarea
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 resize-none max-h-32 min-h-[2.5rem] py-2 px-4 shadow-none appearance-none"
                    rows={1}
                    style={{ height: 'auto' }}
                />
                <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-500/20 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 text-right mt-1 px-1 font-medium">
                Enter to send, Shift + Enter for new line
            </div>
        </div>
    );
};
