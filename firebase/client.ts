import { initializeApp,getApp,getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKmL28pn69h2X1GSIPIwSL32c2STbrmKE",
  authDomain: "prepwise-8fa92.firebaseapp.com",
  projectId: "prepwise-8fa92",
  storageBucket: "prepwise-8fa92.firebasestorage.app",
  messagingSenderId: "1024681754864",
  appId: "1:1024681754864:web:0fd508282fedc8eaa24235",
  measurementId: "G-HTHJGDP240"
};

// Initialize Firebase
const app = !getApps.length? initializeApp(firebaseConfig):getApp();


export const auth = getAuth(app)
export const db=getFirestore(app)