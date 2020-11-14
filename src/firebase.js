import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyB7wkDSoaGd1Iy4ec7GB-wARPi5NTr7Hes",
  authDomain: "socix-8eb8b.firebaseapp.com",
  databaseURL: "https://socix-8eb8b.firebaseio.com",
  projectId: "socix-8eb8b",
  storageBucket: "socix-8eb8b.appspot.com",
  messagingSenderId: "632607520589",
  appId: "1:632607520589:web:0b8158a2a184e20e3de904",
  measurementId: "G-Z0LMZ94QN5",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
