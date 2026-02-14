import { useSocket } from './hooks/useSocket';
import { LoginForm } from './components/LoginForm';
import { ChatContainer } from './components/ChatContainer';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const {
    currentUser,
    availableRooms,
    usersInRoom,
    messages,
    typingUsers,
    error,
    actions
  } = useSocket();

  if (!currentUser) {
    return (
      <ThemeProvider>
        <LoginForm onJoin={actions.joinGame} error={error} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ChatContainer
        currentUser={currentUser}
        currentRoom={currentUser.room || 'General'}
        availableRooms={availableRooms}
        usersInRoom={usersInRoom}
        messages={messages}
        typingUsers={typingUsers}
        onSwitchRoom={actions.switchRoom}
        onSendMessage={actions.sendMessage}
        onTyping={actions.setTyping}
        onCreateRoom={actions.createRoom}
        onLogout={actions.logout}
      />
    </ThemeProvider>
  );
}

export default App;
