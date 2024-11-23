// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyABg-rPktOZNcHWByrzO9IV2hX62I6sd5s",
    authDomain: "urvashi-chat-system.firebaseapp.com",
    databaseURL: "https://urvashi-chat-system-default-rtdb.firebaseio.com",
    projectId: "urvashi-chat-system",
    storageBucket: "urvashi-chat-system.firebasestorage.app",
    messagingSenderId: "530234119383",
    appId: "1:530234119383:web:60b0f282d7396bf13d4c92",
    measurementId: "G-9JZH2WEZ3Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);