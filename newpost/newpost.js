// Import the functions you need from the SDKs you need
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-storage.js";
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
      // console.log('Username:', first_name);
      document.getElementById("user").innerHTML = username;
    } else {
      // User was not found using their email
      console.log('User not found in the database');
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








function logout(){
  signOut(auth).then(() => {
    location.replace("/login");
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}      




//Function for posting A POst
function post1(){
  const auth=getAuth();
  onAuthStateChanged(auth,(user)=>{
    if (user) {
      var title = document.getElementById("title").value;
      var detail = document.getElementById("detail").value;
      var files = document.getElementById("file").files;
      var author = user.email;
      var visible = document.getElementById("visible").value;
      var themename = rightnow();
    
      if (files.length > 0) {
        var uploadCount = 0;
        var urls = [];
    
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var storageRef = firebase.storage().ref('files/' + themename+'/'+file.name);
          var uploadTask = storageRef.put(file);
    
          uploadTask.on('state_changed', function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var element = document.getElementById("myprogressBar");
            element.style.width = progress + '%';
            
          }, function(error) {
            console.log(error.message);
          }, function() {
            var storageRef = firebase.storage().ref('files/'+themename);
            storageRef.listAll().then(function(result) {
              result.items.forEach(function(fileRef) {
                fileRef.getDownloadURL().then(function(url) {
                  console.log(url);
                  urls.push(url);
                  // Do something with the URL, such as displaying it on the page
                  uploadCount++;
                  console.log(uploadCount,files.length);
                  
                  if (uploadCount == files.length) {
                    //urls.shift();
                    saveBlogToDatabase(urls);
                  }
                });
              });
            });
          });
        }
      } else {
        saveBlogToDatabase([]);
      }
    
      function saveBlogToDatabase(urls) {
        firebase.database().ref('blogs').push().set({
          title: title,
          author: author,
          visible: visible,
          date: rightnow(),
          detail: detail,
          fileUrls: urls
        }, function(error) {
          if (error) {
            console.log("Error while uploading", error);
          } else {
            console.log("Post uploaded successfully");
            alert("Post successfully uploaded");
            document.getElementById('post-form').reset();
            location.reload();
          }
        });
      }
    }
  })
}
// function post1(){
//   const auth = getAuth();
//   onAuthStateChanged(auth, (user) => {
//   if (user) {
//     var title = document.getElementById("title").value;
//     var detail = document.getElementById("detail").value;
//     var file = document.getElementById("file").files[0];
//     var themename = rightnow();
//     var author = user.email;
//     var visible = document.getElementById("visible").value;
//     if(file){
//       var storageRef = firebase.storage().ref('files/'+themename);
//       var uploadTask = storageRef.put(file);
//         uploadTask.on('state_changed', function(snapshot) {
//           var progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
//           // console.log("byte trasfered"+snapshot.bytesTransferred);
//           // console.log("byte total"+snapshot.totalBytes);
//           // console.log("progress"+progress);
//           var element = document.getElementById("myprogressBar");
//           element.style.width = progress + '%';
//         }
//       , function(error) {
//         console.log(error.message);
//       }, function() {
//         uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
//           firebase.database().ref('blogs').push().set({
//             title: title,
//             author: author,
//             visible: visible,
//             date: rightnow(),
//             detail: detail,
//             fileUrl: downloadURL
//           }, function(error) {
//             if(error) {
//               console.log("Error while uploading" ,error);
//             } else {
//               console.log("Post uploaded successfully");
//               alert("Post successfully uploaded");
//               document.getElementById('post-form').reset();
//               location.reload();
//             }
//           })
//         })
//       });
//     } else {
//       firebase.database().ref('blogs').push().set({
//         title: title,
//         author: author,
//         visible: visible,
//         date: rightnow(),
//         detail: detail,
//         fileUrl: "none"
//       }, function(error) {
//         if(error) {
//           console.log("Error while uploading" ,error);
//         } else {
//           alert("Post successfully uploaded");
//           document.getElementById('post-form').reset();
//           location.reload();
//         }
//       });
//     }

//   }
//   });
// }


// function visible(){
//   const radios = document.getElementsByName('exampleRadios');

//   console.log(radios.values);

//   //console.log(selectedValue);
//   //return(selectedValue);
// }
// visible();

//Old Post Function Us it if found any problem..
// function post(){
//   const auth = getAuth();
//   onAuthStateChanged(auth, (user) => {
//   if (user) {
//     var title = document.getElementById("title").value;
//     //var description = document.getElementById("description").value;
//     var detail = document.getElementById("detail").value;
//     var file = document.getElementById("file").files[0];
//     var themename = rightnow();
//     var author = user.email;
//     var visible = document.getElementById("visible").value;
//     var storageRef = firebase.storage().ref('files/'+themename);
//     var uploadTask = storageRef.put(file);
//     uploadTask.on('state_changed',function(snapshot){
//       var progress=(snapshot.bytesTranferred/snapshot.totalBytes)*100;
//     },function(error){
//         console.log(error.message);
//     },function(){
//       //const auth = getAuth();
//       //console.log(user);
//       uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
//         firebase.database().ref('blogs').push().set({
//           title:title,
//           author: author,
//           visible: visible,
//           date: rightnow(),
//           //description:description,
//           detail:detail,
//           fileUrl:downloadURL
//         },function(error){
//           if(error){
//             console.log("Error while uploading" ,error);
//           }
//           else{
//             console.log("POst uploaded sucessfully");
//             alert("Post successfully uploaded");
//             document.getElementById('post-form').reset();
//             location.reload();
//           }
//         })
//       })
//     });

// }
// });
// }


// onAuthStateChanged(auth, (user) => {
//   if (user) {
//   // The user object has basic properties such as display name, email, etc.
//   const displayName = user.displayName;
//   const email = user.email;
//   const photoURL = user.photoURL;
//   const emailVerified = user.emailVerified;
//   // The user's ID, unique to the Firebase project. Do NOT use
//   // this value to authenticate with your backend server, if
//   // you have one. Use User.getToken() instead.
//   const uid = user.uid;
// }
// });


function rightnow(){
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var day = currentDate.getDate().toString().padStart(2, '0');
  var hours = currentDate.getHours().toString().padStart(2, '0');
  var minutes = currentDate.getMinutes().toString().padStart(2, '0');
  var seconds = currentDate.getSeconds().toString().padStart(2, '0');
  var formattedDate = year + '-' + month + '-' + day + '_' + hours + '-' + minutes + '-' + seconds;
  return(formattedDate);
}

// //get all post from the firebase
// function getposts(){
//   const auth = getAuth();
//   onAuthStateChanged(auth, (user) => {
//   firebase.database().ref('blogs').once('value').then(function(snapshot){
//     //get your posts div
//     var posts_div=document.getElementById('posts');
//     //remove all remaining data in that div
//     posts.innerHTML="";
//     //get data from firebase
//     var data=snapshot.val();
//     //console.log(data);
//     //now pass this data to our posts div
//     //we have to pass our data to for loop to get one by one
//     //we are passing the key of that post to delete it from database
//     for(let[key,value] of Object.entries(data)){
//       if(value.visible=='public'||value.author==user.email){
//       posts_div.innerHTML="<div class='col-sm-4 mt-2 mb-1'>"+
//       "<div class='card' style='padding:3%;'<h6><i>"+value.date+"</i></h6>"+
//       "<h1><b><u>"+value.title+"</u></b></h1>"+
//       "<div class='card-body'><p class='card-text'>"+value.detail.slice(0,200)+"....</p>"+
//       "<br>by: "+value.author+"<a href= '/view.html?postid="+key+"' class= 'btn btn-info' name='read' id='"+key+"' style='float: right;'>Read</a></div></div></div>"+posts_div.innerHTML;
//     }
//     }
  
//   });
// });
// }
// function delete_post(key){
//   console.log("hello")
//   console.log(key);
//   firebase.database().ref('blogs'+key).remove();
//   getposts();

// }

// window.onload=function(){
//   getposts();
// }

document.getElementById("Logout").addEventListener('click',logout);
document.getElementById('submit').addEventListener('click', post1);
//document.getElementsByName('delete').addEventListener('click', delete_post(this.id));
