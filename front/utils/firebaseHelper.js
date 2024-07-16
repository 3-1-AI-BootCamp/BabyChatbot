// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const getFirebaseApp = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyDDLd9BqDenAFef-OuF2zBS2JNVerR1G-M",
        authDomain: "calendarrecipe.firebaseapp.com",
        projectId: "calendarrecipe",
        storageBucket: "calendarrecipe.appspot.com",
        messagingSenderId: "600725474057",
        appId: "1:600725474057:web:339ef0d9d179265d9721d8",
        measurementId: "G-JL9NRBNN82"
      };

    // Initialize Firebase
    return initializeApp(firebaseConfig)
}
