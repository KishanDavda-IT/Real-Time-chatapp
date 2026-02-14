import React, { useEffect, useRef } from 'react';
import type { Message, User } from '../hooks/useSocket';

interface MessageListProps {
    messages: Message[];
    currentUser: User | null;
    typingUsers: Set<string>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, typingUsers }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUsers]);

    return (
        <div className="flex-1 overflow-y-auto p-4 pt-20 pb-28 space-y-4 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300 scroll-smooth">
            {messages.map((msg, index) => {
                const isMe = msg.senderId === currentUser?.id;
                const isSystem = msg.type === 'system';
                const showAvatar = !isMe && !isSystem && (index === 0 || messages[index - 1].senderId !== msg.senderId);

                if (isSystem) {
                    return (
                        <div key={msg.id} className="flex justify-center my-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700">
                                {msg.content}
                            </span>
                        </div>
                    );
                }

                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                        {!isMe && (
                            <div className="w-8 flex-shrink-0 mr-2 flex flex-col justify-end">
                                {showAvatar ? (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                                        {msg.senderName.substring(0, 2).toUpperCase()}
                                    </div>
                                ) : <div className="w-8" />}
                            </div>
                        )}

                        <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            {!isMe && showAvatar && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 mb-1">{msg.senderName}</span>
                            )}

                            <div className={`px-4 py-2 rounded-2xl shadow-sm ${isMe
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-purple-500/20'
                                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-600'
                                } break-words`}>
                                {msg.content}
                            </div>
                            <div className={`text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-1 ${isMe ? 'text-slate-400 dark:text-slate-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                );
            })}

            <div ref={bottomRef} />
        </div>
    );
};
