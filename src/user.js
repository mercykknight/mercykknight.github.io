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
    if(user.photoURL){
      const img = document.getElementById('avatar');
      img.src = user.photoURL;
    }
    //Apply and show the blog with the key in url..
    const urlParams = new URLSearchParams(window.location.search);

    // Get the random number from the URL
    const userprofile = urlParams.get('user');
    //getPostByKey(key);
    console.log(userprofile);
    //finding data of user
    const database = firebase.database();

  // Search for the user's data using their email
  firebase.database().ref('users/' + userprofile).once('value').then(function(snapshot){
    if (snapshot.exists()) {
    var data =  snapshot.val();
      console.log(data);
      document.getElementById("user").innerHTML = userprofile;
      document.getElementById("username").innerHTML = data.username;
      document.getElementById("email").innerHTML = data.email;
      document.getElementById("first_name").innerHTML = data.first_name;
      document.getElementById("last_name").innerHTML = data.last_name;
      document.getElementById("profession").innerHTML = data.profession;
      document.getElementById("about").innerHTML = data.about;
      if(data.photoURL){
        document.getElementById("profile-image").src = data.photoURL;
      }
    }else{
        console.log("User doesn't exists");
    }
});
    // ...
}
});


function logout(){
  signOut(auth).then(() => {
    location.replace("/login");
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}           
document.getElementById("Logout").addEventListener('click',logout);

