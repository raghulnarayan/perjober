// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUi38mYEpVSngwTQXgQ5-EZqG0tz2pxf4",
  authDomain: "missionmasters-ba010.firebaseapp.com",
  projectId: "missionmasters-ba010",
  storageBucket: "missionmasters-ba010.firebasestorage.app",
  messagingSenderId: "222214646351",
  appId: "1:222214646351:web:9c00e2d25eda3f850e183a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);