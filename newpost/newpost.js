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

//Function for posting A POst
function post1() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      var title = document.getElementById("title").value;
      //var detail = document.getElementById("detail").value;
      var detail = document.getElementById("editor").innerHTML;
      var files = document.getElementById("file").files;
      var author = user.displayName;
      var visible = document.getElementById("visible").value;
      var themename = rightnow();

      if (files.length > 0) {
        var uploadCount = 0;
        var urls = [];

        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var storageRef = firebase
            .storage()
            .ref("files/" + themename + "/" + file.name);
          var uploadTask = storageRef.put(file);
          console.log("File name->", i, file.name);
          uploadTask.on(
            "state_changed",
            function (snapshot) {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              var element = document.getElementById("myprogressBar");
              element.style.width = progress + "%";
            },
            function (error) {
              console.log(error.message);
            },
            function () {
              var storageRef = firebase.storage().ref("files/" + themename);
              storageRef.listAll().then(function (result) {
                result.items.forEach(function (fileRef) {
                  fileRef.getDownloadURL().then(function (url) {
                    if (!urls.includes(url)) {
                      console.log(url);
                      urls.push(url);
                      uploadCount++;
                      console.log(uploadCount, files.length);
                    }
                    // Do something with the URL, such as displaying it on the page

                    if (uploadCount == files.length) {
                      //urls.shift();
                      saveBlogToDatabase(urls);
                    }
                  });
                });
              });
            }
          );
        }
      } else {
        saveBlogToDatabase([]);
      }

      function saveBlogToDatabase(urls) {
        firebase
          .database()
          .ref("blogs")
          .push()
          .set(
            {
              title: title,
              author: author,
              visible: visible,
              date: rightnow(),
              detail: detail,
              fileUrls: urls,
            },
            function (error) {
              if (error) {
                console.log("Error while uploading", error);
              } else {
                console.log("Post uploaded successfully");
                alert("Post successfully uploaded");
                document.getElementById("post-form").reset();
                location.reload();
              }
            }
          );
      }
    }
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

document.getElementById("Logout").addEventListener("click", logout);
document.getElementById("submit").addEventListener("click", post1);
//document.getElementsByName('delete').addEventListener('click', delete_post(this.id));
