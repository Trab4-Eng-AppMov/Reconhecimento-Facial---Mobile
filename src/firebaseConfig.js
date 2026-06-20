import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCRMhkehe-zMW0AJdPK6oVAZ6vYeGToD6g",
  authDomain: "trabalho4will.firebaseapp.com",
  projectId: "trabalho4will",
  storageBucket: "trabalho4will.firebasestorage.app",
  messagingSenderId: "762758739601",
  appId: "1:762758739601:web:37f9c81b5b665f2b5d3130"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
