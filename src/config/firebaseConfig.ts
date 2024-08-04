import { initializeApp } from "firebase/app";


export const firebaseConfig = {
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);

export default app


