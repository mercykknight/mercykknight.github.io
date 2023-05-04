document.getElementById("submit").addEventListener("click", function(event){
    event.preventDefault()
  });

// Import the functions you need from the SDKs you need
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";

import "https://www.gstatic.com/firebasejs/8.1.1/firebase-database.js";

//import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword , updateProfile} from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyARhzsE4KXzGNFzMxNRS949K8m0iMYp3lY",
  authDomain: "pirates-b1fed.firebaseapp.com",
  databaseURL: "https://pirates-b1fed-default-rtdb.firebaseio.com", 
  projectId: "pirates-b1fed",
  storageBucket: "pirates-b1fed.appspot.com",
  messagingSenderId: "1049996372033",
  appId: "1:1049996372033:web:5b1ee4f528da076b98fec0",
  measurementId: "G-5BBZPSWYTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// function writeUserData(userId, name, email, imageUrl) {
//   firebase.database().ref('users/' + userId).set({
//     username: userId,
//     email: email,
//     profile_picture : imageUrl
//   });
// }
// Sigup new user EKA Register new User


function register(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const profession = document.getElementById("profession").value;
    const username = document.getElementById("username").value;
    username.replace(/\s+/g, "");
    username.toLowerCase();
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const auth = getAuth();
    const database = firebase.database();
    database.ref('users').orderByChild('username').equalTo(username).once('value')
      .then((snapshot) => {
      // Check if the user exists in the database
      if (snapshot.exists()) {
        // Get the email associated with the user
        const userData = snapshot.val();
        const userEmail = userData[Object.keys(userData)[0]].email;
        document.getElementById("alert").innerHTML = `This username already exists with ${userEmail}`;
        document.getElementById("alert2").innerHTML = "";
        //console.log(`The email associated with ${username} is ${userEmail}`);
      } else {
        //console.log(`${username} does not exist in the database`);
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const userId = userCredential.user.uid;
            const displayName = username;
            // Set the display name
            updateProfile(auth.currentUser,{
              displayName: displayName
            }).then(() => {
              console.log("Successful username updated");
            }).catch((error) => {
              console.log("error in username updating");
            });


        // Save the user details to the Realtime Database
        firebase.database().ref('users/' + username).set({
          userId: userId,
          email: email,
          first_name: first_name,
          last_name: last_name,
          username: username,
          profession: profession,
          about: '',
          photoURL: ''
          
        })
        // .then(() => {
        //   // Success: Redirect the user to the dashboard or home page
        //   window.location.href = '/dashboard';
        // })
          document.getElementById("alert2").innerHTML = "Succefully registered Click Here to sign in <a href='/login'>login</a>";
          document.getElementById("alert").innerHTML = "";
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode+" "+errorMessage);
            document.getElementById("alert").innerHTML = error.code;
            document.getElementById("alert2").innerHTML = "";
            // ..
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
document.getElementById('submit').addEventListener('click', register);