import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import dotenv from 'dotenv'

dotenv.config()

export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function authenticateUser() {
    await signInWithEmailAndPassword(auth, process.env.FIREBASE_ADMIN_USER, process.env.FIREBASE_ADMIN_PASSWORD)
}

authenticateUser()

export const storage = getStorage(app)


