import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDixdnUWhoU6N-r_gJQsExS3E50oA6wbYQ",
  authDomain: "interndekho-55b5d.firebaseapp.com",
  projectId: "interndekho-55b5d",
  storageBucket: "interndekho-55b5d.appspot.com",
  messagingSenderId: "1954340944",
  appId: "1:1954340944:web:113fb95d59c756bbe33155"
};

// Initialize Firebase
const fb = initializeApp(firebaseConfig);

export default fb;