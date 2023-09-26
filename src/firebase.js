// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1pNHHhXq1k0S8oFJddvKodplbCJSMCMs",
  authDomain: "shahzaib-chatapp.firebaseapp.com",
  projectId: "shahzaib-chatapp",
  storageBucket: "shahzaib-chatapp.appspot.com",
  messagingSenderId: "819336140295",
  appId: "1:819336140295:web:6e2431ec462d6098bdfca2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);