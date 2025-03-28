// Import the functions you need from the SDKs you need
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
//import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
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
  measurementId: "G-5BBZPSWYTH",
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
    if (user.photoURL) {
      const img = document.getElementById("avatar");
      img.src = user.photoURL;
    }
    //finding data of user
    const database = firebase.database();

    // Search for the user's data using their email
    database
      .ref("users")
      .orderByChild("email")
      .equalTo(user.email)
      .once("value")
      .then((snapshot) => {
        // Check if the user exists in the database
        if (snapshot.exists()) {
          // User was found using their email
          const userData = snapshot.val();
          // Get the username from the user data
          const username = Object.keys(userData)[0];

          const { first_name, last_name, profession, userId, email } =
            userData[username];
          // console.log('Username:', first_name);
          document.getElementById("user").innerHTML = username;
        } else {
          // User was not found using their email
          console.log("User not found in the database");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// Get the email or username to search for

// Get a reference to the Firebase Realtime Database
// Replace with the email you want to search for

// Get a reference to the Firebase Realtime Database

function logout() {
  signOut(auth)
    .then(() => {
      location.replace("/login");
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}

function rightnow() {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  var day = currentDate.getDate().toString().padStart(2, "0");
  var hours = currentDate.getHours().toString().padStart(2, "0");
  var minutes = currentDate.getMinutes().toString().padStart(2, "0");
  var seconds = currentDate.getSeconds().toString().padStart(2, "0");
  var formattedDate =
    year +
    "-" +
    month +
    "-" +
    day +
    "_" +
    hours +
    "-" +
    minutes +
    "-" +
    seconds;
  return formattedDate;
}

//get all post from the firebase
function getposts() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    firebase
      .database()
      .ref("blogs")
      .once("value")
      .then(function (snapshot) {
        //get your posts div
        var posts_div = document.getElementById("posts");
        //remove all remaining data in that div
        posts.innerHTML = "";
        //get data from firebase
        var data = snapshot.val();
        //console.log(data);
        //now pass this data to our posts div
        //we have to pass our data to for loop to get one by one
        //we are passing the key of that post to delete it from database
        function delete_post(key) {
          console.log("hello");
          console.log(key);
          //firebase.database().ref('blogs'+key).remove();
          //getposts();
        }
        for (let [key, value] of Object.entries(data)) {
          if (
            (value.author == user.email || value.author == user.displayName) &&
            value.visible == "private"
          ) {
            posts_div.innerHTML =
              "<div class='col-sm-4 mt-2 mb-1'>" +
              "<div class='card' style='padding:3%;'><div style='display:flex; justify-content: space-between;'><h6><i>" +
              value.date +
              "</i></h6><button onclick=ppp('" +
              key +
              "') class='btn btn-white' style='text-decoration:none;'><svg style='align:right;' xmlns='http://www.w3.org/2000/svg' width='20' height='20' id= 'lock" +
              key +
              "' fill='red' class='bi bi-lock-fill' viewBox='0 0 16 16'> <path d='M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z'/> </svg></button></div>" +
              "<a href= '/view.html?postid=" +
              key +
              "' style='text-decoration:none;color: black;' id='" +
              key +
              "''><h1><b>" +
              value.title +
              "</b></h1></a>" +
              "<div class='card-body'><a href= '/view.html?postid=" +
              key +
              "' style='text-decoration:none;color: black;' id='" +
              key +
              "''><p class='card-text'>" +
              value.detail.slice(0, 200).replace(/<\/?[^>]+(>|$)/g, " ") +
              "....</p></a>" +
              "<br>by: " +
              value.author +
              "<button onclick= edit_post('" +
              key +
              "'); class= 'btn btn-info edit-button' name='read' id='" +
              key +
              "' style='float: right;'>Edit</button>" +
              "<button onclick=delete_post('" +
              key +
              "'); class= 'btn btn-danger' name='deleteButton' id='deleteButton' style='float: right; margin-right: 10px;'>Delete</button></div></div></div>" +
              posts_div.innerHTML;
          } else if (
            (value.author == user.email || value.author == user.displayName) &&
            value.visible == "public"
          ) {
            posts_div.innerHTML =
              "<div class='col-sm-4 mt-2 mb-1'>" +
              "<div class='card' style='padding:3%;'><div style='display:flex; justify-content: space-between;'><h6><i>" +
              value.date +
              "</i></h6><button onclick=ppp('" +
              key +
              "') class='btn btn-white' style='text-decoration:none;'><svg style='align:right;' xmlns='http://www.w3.org/2000/svg' width='16' height='16' id= 'lock" +
              key +
              "' fill='green' class='bi bi-unlock-fill' viewBox='0 0 16 16'> <path d='M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z'/> </svg></button></div>" +
              "<a href= '/view.html?postid=" +
              key +
              "' style='text-decoration:none;color: black;' id='" +
              key +
              "'><h1><b>" +
              value.title +
              "</b></h1></a>" +
              "<div class='card-body'><a href= '/view.html?postid=" +
              key +
              "' style='text-decoration:none;color: black;' id='" +
              key +
              "''><p class='card-text'>" +
              value.detail.slice(0, 200).replace(/<\/?[^>]+(>|$)/g, " ") +
              "....</p></a>" +
              "<br>by: " +
              value.author +
              "<button onclick= edit_post('" +
              key +
              "'); class= 'btn btn-info edit-button' name='read' id='" +
              key +
              "' style='float: right;'>Edit</button>" +
              "<button onclick= delete_post('" +
              key +
              "'); class= 'btn btn-danger' name='read' id='" +
              key +
              "' style='float: right; margin-right: 10px;'>Delete</button></div></div></div>" +
              posts_div.innerHTML;
          }
        }
      });
  });
}
function delete_post(key) {
  firebase
    .database()
    .ref("blogs" + key)
    .remove();
  //getposts();
}

window.onload = function () {
  getposts();
};

document.getElementById("Logout").addEventListener("click", logout);
//document.getElementById('submit').addEventListener('click', post1);
//document.getElementsByName('delete').addEventListener('click', delete_post(this.id));
