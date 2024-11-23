import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

const ChatRoom = ({ chatId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);

    // Effect to listen to changes in authentication state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    // Effect to listen to messages in Firestore
    useEffect(() => {
        const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
        const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
            const messagesData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setMessages(messagesData);
        });

        return () => unsubscribeMessages();
    }, [chatId]);

    // Function to send a message to Firestore
    const sendMessage = async () => {
        // Ensure newMessage is a valid string and not undefined or empty
        if (!newMessage || newMessage.trim() === "") {
            console.log("Message is empty, not sending.");
            return; // Prevent sending empty messages
        }

        try {
            // Correct path: "chats/{chatId}/messages"
            const messagesRef = collection(db, "chats", chatId, "messages");

            // Add message to Firestore
            await addDoc(messagesRef, {
                text: newMessage,              // Message content
                createdAt: serverTimestamp(),  // Timestamp when the message is sent
                uid: user.uid,                 // The UID of the user sending the message
            });

            console.log("Message sent successfully!");
            setNewMessage("");  // Clear input field after sending
        } catch (error) {
            console.error("Error sending message:", error.message);
        }
    };

    return (
        <div>
            <div className="messages">
                {messages.map((message) => (
                    <div key={message.id} className="message">
                        <p>{message.text}</p>
                        <small>{message.createdAt?.toDate().toLocaleString()}</small>
                    </div>
                ))}
            </div>

            {user && (
                <div className="sendMessageContainer">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
