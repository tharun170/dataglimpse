import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAIqYBqnysqFM-SWaDgAB1RJuQdLTQFlMM",
  authDomain: "authentication-1701c.firebaseapp.com",
  projectId: "authentication-1701c",
  storageBucket: "authentication-1701c.appspot.com",
  messagingSenderId: "906550741035",
  appId: "1:906550741035:web:a692512e38227f358fc26e",
  measurementId: "G-2DTKLE9HDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();