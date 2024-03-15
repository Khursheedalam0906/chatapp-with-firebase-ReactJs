import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1ywyvOO2NS5PFJmC4QgJ5oebKFM8IMME",
  authDomain: "chat-app-ab145.firebaseapp.com",
  projectId: "chat-app-ab145",
  storageBucket: "chat-app-ab145.appspot.com",
  messagingSenderId: "559493788947",
  appId: "1:559493788947:web:edf0df61a55ae6fb28d6e6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
