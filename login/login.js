import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, sendSignInLinkToEmail } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

//set up button so that page don't reload..

document.getElementById("submit").addEventListener("click", function(event){
  event.preventDefault()
});

// It will check the state if user is logged in or logged out..

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    location.replace("/dashboard");
    // ...
  } else {
    // User is signed out
    // ...
  }
});

// login function to check for user credentials..
function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = getAuth();
  //alert(auth);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById("alert").innerHTML=error.code;
    });  

  }
//event lister for submiting the button.
document.getElementById('submit').addEventListener('click', login);

//SignIn using link
function signup(){
  location.replace("/register");
}

document.getElementById('signup').addEventListener('click', signup);

//Forget Password Alias Password Reset:
function forgetPassword(){
  const email = document.getElementById("email").value;
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      document.getElementById("alert").innerHTML="Password Reset Link has been sent to your email";
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById("alert").innerHTML=error.code;
      // ..
    });
}
document.getElementById('forget-password').addEventListener('click', forgetPassword);



