import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAfWlUyS8nCUvoEBA7bqJ1fXFZYKzhuNNs",
    authDomain: "micomidafavorita-76cee.firebaseapp.com",
    projectId: "micomidafavorita-76cee",
    storageBucket: "micomidafavorita-76cee.firebasestorage.app",
    messagingSenderId: "991051575500",
    appId: "1:991051575500:web:c76cb2ef4863bde083d269",
    measurementId: "G-586RPX7RZV"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);