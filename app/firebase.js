import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDFe3_GHlK59u-L4_kEQZxG8qqzjsI18wE",
    authDomain: "shift-management-a2765.firebaseapp.com",
    projectId: "shift-management-a2765",
    storageBucket: "shift-management-a2765.firebasestorage.app",
    messagingSenderId: "445762800269",
    appId: "1:445762800269:web:4d7a983f2a152ab397f0c4"
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


