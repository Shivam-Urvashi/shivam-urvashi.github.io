import { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { ref, push, onValue, off } from 'firebase/database';
import { signOut } from 'firebase/auth';
import styles from '../styles/Chat.module.css';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Listen for online users
    useEffect(() => {
        const usersRef = ref(database, 'users');

        // Add current user to online users
        const currentUser = {
            email: auth.currentUser.email,
            uid: auth.currentUser.uid,
            lastSeen: new Date().toISOString()
        };

        push(usersRef, currentUser);

        // Listen for other online users
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const usersList = Object.entries(data)
                    .map(([id, user]) => ({
                        ...user,
                        id
                    }))
                    .filter(user => user.uid !== auth.currentUser.uid); // Exclude current user
                setUsers(usersList);
            }
        });

        return () => {
            off(usersRef);
        };
    }, []);

    // Listen for messages
    useEffect(() => {
        if (!selectedUser) return;

        const chatId = [auth.currentUser.uid, selectedUser.uid].sort().join('-');
        const messagesRef = ref(database, `chats/${chatId}/messages`);

        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messagesList = Object.entries(data).map(([id, msg]) => ({
                    id,
                    ...msg
                }));
                setMessages(messagesList);
            } else {
                setMessages([]);
            }
        });

        return () => {
            off(messagesRef);
        };
    }, [selectedUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser) return;

        const chatId = [auth.currentUser.uid, selectedUser.uid].sort().join('-');
        const messagesRef = ref(database, `chats/${chatId}/messages`);

        await push(messagesRef, {
            text: message,
            sender: auth.currentUser.email,
            senderUid: auth.currentUser.uid,
            timestamp: Date.now()
        });

        setMessage('');
    };

    const handleLogout = () => {
        signOut(auth);
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.header}>
                <h2>Pahado chat system: for Bahadrabad - Jhabrera</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.usersList}>
                    <h3>Online Users</h3>
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`${styles.userItem} ${selectedUser?.id === user.id ? styles.selected : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {user.email}
                        </div>
                    ))}
                </div>

                <div className={styles.chatArea}>
                    {selectedUser ? (
                        <>
                            <div className={styles.chatHeader}>
                                Chatting with: {selectedUser.email}
                            </div>
                            <div className={styles.messagesContainer}>
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`${styles.message} ${msg.senderUid === auth.currentUser.uid ? styles.sent : styles.received
                                            }`}
                                    >
                                        <span className={styles.sender}>{msg.sender}</span>
                                        <p>{msg.text}</p>
                                        <span className={styles.timestamp}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSubmit} className={styles.inputContainer}>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <button type="submit">Send</button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.selectUserPrompt}>
                            Select a user to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat; 