import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDxyT-ed5EqEavtZ5Ovxwgex_HHqgob8Io",
    authDomain: "e-clone-67cd5.firebaseapp.com",
    databaseURL: "https://e-clone-67cd5.firebaseio.com",
    projectId: "e-clone-67cd5",
    storageBucket: "e-clone-67cd5.appspot.com",
    messagingSenderId: "298580138351",
    appId: "1:298580138351:web:a81d0753d6c54b83f9309a",
    measurementId: "G-W0BJ1S9EZB"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  
  export { db, auth };