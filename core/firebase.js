import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRMhkehe-zMW0AJdPK6oVAZ6vYeGToD6g",
  authDomain: "trabalho4will.firebaseapp.com",
  projectId: "trabalho4will",
  storageBucket: "trabalho4will.firebasestorage.app",
  messagingSenderId: "762758739601",
  appId: "1:762758739601:web:37f9c81b5b665f2b5d3130",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
