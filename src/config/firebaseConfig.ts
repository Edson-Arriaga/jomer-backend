import { initializeApp } from "firebase/app";


export const firebaseConfig = {
    apiKey: "AIzaSyAhLrCVe4SOnHvoXC0CJ3LATe347z3b0UA",
    authDomain: "jomer-ba42e.firebaseapp.com",
    projectId: "jomer-ba42e",
    storageBucket: "jomer-ba42e.appspot.com",
    messagingSenderId: "887340336394",
    appId: "1:887340336394:web:cccb71a25f6a86975e66f3",
    measurementId: "G-33MXT1CLQJ"
};

const app = initializeApp(firebaseConfig);

export default app


