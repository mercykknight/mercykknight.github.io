// Import the functions you need from the SDKs you need
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARhzsE4KXzGNFzMxNRS949K8m0iMYp3lY",
  authDomain: "pirates-b1fed.firebaseapp.com",
  projectId: "pirates-b1fed",
  storageBucket: "pirates-b1fed.appspot.com",
  messagingSenderId: "1049996372033",
  appId: "1:1049996372033:web:5b1ee4f528da076b98fec0",
  measurementId: "G-5BBZPSWYTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
firebaseConfig.app;
//const analytics = getAnalytics(app);
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
if (!user) {
    // User is signed out, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    location.replace("/login");
    // ...
} else {
    // User is singned in
    
    
    //finding data of user
    const database = firebase.database();

  // Search for the user's data using their email
  database.ref('users').orderByChild('email').equalTo(user.email).once('value')
    .then((snapshot) => {
    // Check if the user exists in the database
    if (snapshot.exists()) {
      // User was found using their email
      const userData = snapshot.val();
      // Get the username from the user data
      const username = Object.keys(userData)[0];
      
      const { first_name, last_name ,profession,userId,email} = userData[username];
      console.log('Username:', username);
      // console.log('Username:', first_name);
      document.getElementById("user").innerHTML = username;
      document.getElementById("username").innerHTML = username;
      document.getElementById("email").innerHTML = email;
      document.getElementById("first_name").innerHTML = first_name;
      document.getElementById("last_name").innerHTML = last_name;
      document.getElementById("profession").innerHTML = profession;
    } else {
      // User was not found using their email
      console.log('User not found in the database');
    }
  })
  .catch((error) => {
    console.error(error);
  });

    // ...
}
});


// Get the email or username to search for

// Get a reference to the Firebase Realtime Database
 // Replace with the email you want to search for

// Get a reference to the Firebase Realtime Database








function logout(){
  signOut(auth).then(() => {
    location.replace("/login");
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}           
document.getElementById("Logout").addEventListener('click',logout);