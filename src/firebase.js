// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics  } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNfT4b-HKkQcBLpUuBd4i-Gp4D8-Ki4h4",
  authDomain: "instagram-clone-react-52e28.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-52e28-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "instagram-clone-react-52e28",
  storageBucket: "instagram-clone-react-52e28.appspot.com",
  messagingSenderId: "74344130570",
  appId: "1:74344130570:web:2d518043b0aad0e3ffd7f3",
  measurementId: "G-KBT7N12VPS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db,auth,storage}