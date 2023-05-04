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
    //location.replace("/login");
    document.getElementById("user").innerHTML = "<a href='/login'>SignIn</a>";
    // ...
} else {
    // User is singned in
    if(user.photoURL){
      const img = document.getElementById('avatar');
      img.src = user.photoURL;
    }
  
//  function userdetails(){
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

//Extract the Blog Material And show it here......

// function getposts(){

//     firebase.database().ref('blogs').once('value').then(function(snapshot){
//       //get your posts div
//       var posts_div=document.getElementById('posts');
//       //remove all remaining data in that div
//       posts.innerHTML="";
//       //get data from firebase
//       var data=snapshot.val();
//       //console.log(data);
//       //now pass this data to our posts div
//       //we have to pass our data to for loop to get one by one
//       //we are passing the key of that post to delete it from database
//       for(let[key,value] of Object.entries(data)){
//         if(value.visible=='public'){
//         posts_div.innerHTML="<div class='col-sm-4 mt-2 mb-1'>"+
//         "<div class='card' style='padding:3%;'<h6><i>"+value.date+"</i></h6>"+
//         "<h1><b><u>"+value.title+"</u></b></h1>"+
//         "<div class='card-body'><p class='card-text'>"+value.detail+"</p>"+
//         "<br>by: "+value.author+"<a href= '/view.html?postid="+key+"' class= 'btn btn-info' name='read' id='"+key+"' style='float: right;'>Read</a></div></div></div>"+posts_div.innerHTML;
//       }
//       }
    
//     });

    function getPostByKey(key) {
        firebase.database().ref('blogs/' + key).once('value').then(function(snapshot){
            var data =  snapshot.val();
            //console.log(data);
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                  if(data.visible=="public"){
                        document.getElementById("title").innerHTML = data.title;
                        document.getElementById("author").innerHTML = data.author;
                        document.getElementById("author-profile").setAttribute("href", "/user.html?user=" + data.author);
                        document.getElementById("date-of-post").innerHTML = data.date;
                        document.getElementById("detail").innerHTML = data.detail;
                        firebase.database().ref('users/' + data.author).once('value').then(function(snapshot){
                        var data =  snapshot.val();
                        if(data.photoURL){
                              document.getElementById("author-image").src = data.photoURL;
                            }

                        });
                        console.log(data.fileUrls.length);
                        if(data.fileUrls && data.fileUrls.length > 0){
                            //var fileContainer = document.getElementById("file");
                            for (var i = 0; i < data.fileUrls.length; i++) {
                            var fileurl = data.fileUrls[i];
                            var fileType = getcontenttype(fileurl);
                            var old = document.getElementById("file").innerHTML;
                            //var oldlink = document.getElementById("downloadfile").innerHTML;
                            if(fileType.includes('image')){
                              document.getElementById("file").innerHTML = old+"<img id='frame-img' src='"+fileurl+"' alt='"+fileurl+"' type='"+fileType+"'><a href='"+fileurl+"'><i class='fa fa-download' style='font-size:30px;color:green'></i></a><br>";
                            }else{
                                document.getElementById("file").innerHTML = old+"<iframe id='frame-box' alt='"+fileurl+"' allow-download='false' sandbox='allow-scripts' type='"+fileType+"'></iframe><a href='"+fileurl+"'><i class='fa fa-download' style='font-size:30px;color:green'></i></a><br>";
                                document.getElementById("frame-box").setAttribute('src', fileurl);
                                //loadPdf(fileurl, 'pdf-canvas');

                              }
                          }
                        }
                    }else if(data.visible=="private"){
                        if(data.author==user.displayName){
                            document.getElementById("title").innerHTML = data.title;
                            document.getElementById("author").innerHTML = data.author;   
                            document.getElementById("author-profile").setAttribute("href", "/user.html?user=" + data.author);
                            document.getElementById("date-of-post").innerHTML = data.date;
                            document.getElementById("detail").innerHTML = data.detail;
                            firebase.database().ref('users/' + data.author).once('value').then(function(snapshot){
                              var data =  snapshot.val();
                              if(data.photoURL){
                                    document.getElementById("author-image").src = data.photoURL;
                                  }
      
                              });
                            console.log(data.fileUrls.length);
                            if(data.fileUrls && data.fileUrls.length > 0){
                                //var fileContainer = document.getElementById("file");
                                for (var i = 0; i < data.fileUrls.length; i++) {
                                var fileurl = data.fileUrls[i];
                                var fileType = getcontenttype(fileurl);
                                var old = document.getElementById("file").innerHTML;
                                if(fileType.includes('image')){
                                  document.getElementById("file").innerHTML = old+"<img id='frame-img' src='"+fileurl+"' alt='"+fileurl+"' type='"+fileType+"'><a href='"+fileurl+"'><i class='fa fa-download' style='font-size:30px;color:green'></i></a><br>";
                                }else{
                                    document.getElementById("file").innerHTML = old+"<iframe id='frame-box' src='"+fileurl+"' alt='"+fileurl+"' allow-download='false' type='"+fileType+"'></iframe><a href='"+fileurl+"'><i class='fa fa-download' style='font-size:30px;color:green'></i></a><br>";
                                  }
                                
                                }
                            }
                        }else{
                            console.log("Blog is Private");
                            document.getElementById("alert-info").innerHTML = "This Blog is Private You can't access it.";
                        }
                    }else{
                        console.log("Blog Not Found");
                        document.getElementById("alert-info").innerHTML = "The Blog Doesn't Exists Please check again.";
                    }
                }
                else{
                    if(data.visible=="public"){
                        document.getElementById("title").innerHTML = data.title;
                        document.getElementById("author").innerHTML = data.author;
                        document.getElementById("author-profile").setAttribute("href", "/user.html?user=" + data.author);
                        document.getElementById("date-of-post").innerHTML = data.date;
                        document.getElementById("detail").innerHTML = data.detail;
                        firebase.database().ref('users/' + data.author).once('value').then(function(snapshot){
                          var data =  snapshot.val();
                          if(data.photoURL){
                                document.getElementById("author-image").src = data.photoURL;
                              }
  
                          });
                        console.log(data.fileUrls.length);
                        if(data.fileUrls && data.fileUrls.length > 0){
                            //var fileContainer = document.getElementById("file");
                            for (var i = 0; i < data.fileUrls.length; i++) {
                            var fileurl = data.fileUrls[i];
                            //var fileType = getmetadata(fileurl);
                            var old = document.getElementById("file").innerHTML;
                            if(fileType.includes('image')){
                              document.getElementById("file").innerHTML = old+"<img id='frame-img' src='"+fileurl+"' alt='"+fileurl+"' type='"+fileType+"'><a href='"+fileurl+"'><i class='fa fa-download' style='font-size:30px;color:green'></i></a><br>";
                            }else{
                                document.getElementById("file").innerHTML = old+"<iframe id='frame-box' src='"+fileurl+"' alt='"+fileurl+"' allow-download='false' type='"+fileType+"'></iframe><a href='"+fileurl+"'><i class='fa fa-download' style='font-size:30px;color:green'></i></a><br>";
                              }
                        }
                        }
                    }else if(data.visible=="private"){
                        console.log("Blog is Private");
                        document.getElementById("alert-info").innerHTML = "This Blog is Private You can't access it.";
                    }else{
                        console.log("Blog Not Found");
                        document.getElementById("alert-info").innerHTML = "The Blog Doesn't Exists Please check again.";
                    }
                }
            });
      });
    }

    //Apply and show the blog with the key in url..
    const urlParams = new URLSearchParams(window.location.search);

    // Get the random number from the URL
    const key = urlParams.get('postid');
    getPostByKey(key);

function getmetadata(fileUrl){
    const fileype = '';
    var storage = firebase.storage();
    var fileRef = storage.refFromURL(fileUrl);
    fileRef.getMetadata().then(function(metadata) {
        // Access the contentType property to get the file type
        console.log('File type:', metadata['contentType']);
        const filetype = document.getElementById('frame-box');
        filetype.type = metadata['contentType'];
        fileype = metadata['contentType'];
        return filetype
      }).catch(function(error) {
        console.log('Error getting file metadata:', error);
      });
      console.log(fileype);
}
function getcontenttype(fileUrl){
      if(fileUrl.includes(".jpg") || fileUrl.includes(".jpeg")){
        return "image/jpeg";
      }
      else if(fileUrl.includes(".png")){
      return "image/png";
      }
      else if(fileUrl.includes(".pdf")){
        return "application/pdf";
        }
      else{
        return "";
      }
}


function logout(){
    signOut(auth).then(() => {
      location.replace("/login");
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }      

document.getElementById("Logout").addEventListener('click',logout);