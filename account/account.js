import "https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, updateEmail, onAuthStateChanged, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
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
    console.log(user.displayName);
    if(user.photoURL){
      const img = document.getElementById('avatar');
      img.src = user.photoURL;
    }
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
      
      const { first_name, last_name ,profession,userId,email,about} = userData[username];
      //console.log('Username:', username);
      // console.log('Username:', first_name);
      document.getElementById("user").innerHTML = username;
      document.getElementById("greet").innerHTML = first_name;
      document.getElementById("username").value = username;
      document.getElementById("email").value = email;
      document.getElementById("first_name").value = first_name;
      document.getElementById("last_name").value = last_name;
      document.getElementById("profession").value = profession;
      document.getElementById("about").value = about;
      if(user.photoURL){
        const img = document.getElementById('profile-image');
        img.src = user.photoURL;
      }
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


function update(){
  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const profession = document.getElementById("profession").value;
  const email = document.getElementById("email").value;
  const about = document.getElementById("about").value;
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
  if (!user) {
      // User is signed out, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      location.replace("/login");
      // ...
  } else {
      // User is singned in
       // User is singned in
      console.log(user.displayName);
      //pprofile Photo update
      var files = document.getElementById('fileInput').files;
      if(files.length>0 && files[0]){
        var file = files[0];
        if (user.photoURL && file) {
          var storageRef = firebase.storage().refFromURL(user.photoURL);
          // Delete the file
          storageRef.delete().then(function() {
            console.log("Old File deleted");
            // File deleted successfully
          }).catch(function(error) {
            // Uh-oh, an error occurred!
            console.log(error.message);
          });
        }
        
        var storageRef = firebase.storage().ref('dp/'+user.displayName+'_'+file.name);
        storageRef.put(file).then(function(snapshot) {
          console.log('Uploaded a DP or file!');
          storageRef.getDownloadURL().then(function(url) {
            // Save the download URL to the Firebase Realtime Database
            console.log(url);
            updateProfile(auth.currentUser, {
              photoURL: url
            }).then(() => {
              console.log("Dp uploading successful");
              alert("Changes Saved!");
            }).catch((error) => {
              console.log(error);
            });
          });
      
          });
      }

      var userRef = firebase.database().ref('users/' + user.displayName);
      userRef.update({
        first_name: first_name,
        last_name: last_name,
        profession: profession,
        about: about,
        photoURL: user.photoURL
      }
      , function(error) {
        if (error) {
          console.log("Error updating user data:", error);
        } else {
          console.log("User data updated successfully");
        }
      });
      // if(1==1){
      //   updateEmail(auth.currentUser, email).then(() => {
      //     alert("Email & Userdata updated successfuly");
      //   }).catch((error) => {
      //     alert(error);
      //   });
      // }
    }
  })
  
}





function logout(){
  signOut(auth).then(() => {
    location.replace("/login");
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

function deleteacc(){
  //const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
  if (user) {
      alert("After deleting account you cannot recover your data.")
      if(confirm("Are you sure you want to Delete this Account?")){
      console.log(user.email);
      var databaseRef = firebase.database().ref('users/'+user.displayName);
      databaseRef.remove()
        .then(function() {
          console.log("Entry deleted successfully.");
        })
        .catch(function(error) {
          console.log("Error deleting entry:", error);
        });

      user.delete().then(function() {
        alert("Account deleted Successfully");
      }).catch(function(error) {
        console.log(error.code);
        if(error.code=='auth/requires-recent-login'){
          alert("Logout and login again to Delete your account");
        }
      });
    }
  }
})
}

document.getElementById("Logout").addEventListener('click',logout);
document.getElementById("update").addEventListener('click',update);
document.getElementById("delete-user").addEventListener('click',deleteacc);