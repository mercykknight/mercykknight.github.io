// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  limitToLast,
  get,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.1.1/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
//const analytics = getAnalytics(app);

// const auth = getAuth();
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     location.replace("/dashboard");
//     // ...
//   } else {
//     // User is signed out
//     // ...
//     location.replace("/dashboard");
//   }
// });

// Fetch and display the latest blogs
function fetchRecentBlogs() {
  const recentBlogsContainer = document.getElementById("recent-blogs");

  // Reference to the blogs in the Firebase database
  const blogsRef = query(ref(database, "blogs"), limitToLast(6));

  get(blogsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const blogs = snapshot.val();

        // Clear the container
        recentBlogsContainer.innerHTML = "";

        // Iterate through the blogs and display them
        Object.entries(blogs)
          .reverse()
          .forEach(([key, blog]) => {
            const blogCard = `
              <div class="col-md-4 mb-3">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">${blog.title}</h5>
                    <p class="card-text">${blog.detail
                      .replace(/<\/?[^>]+(>|$)/g, " ")
                      .slice(0, 150)}...</p>
                    <a href="/view.html?postid=${key}" class="btn btn-primary">Read More</a>
                  </div>
                </div>
              </div>
            `;

            // Append the blog card to the container
            recentBlogsContainer.innerHTML += blogCard;
          });
      } else {
        console.log("No blogs found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching recent blogs:", error);
    });
}
// Call the function to fetch and display recent blogs
fetchRecentBlogs();
