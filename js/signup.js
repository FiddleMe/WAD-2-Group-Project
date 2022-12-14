// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";
import { getFirestore, doc, arrayUnion, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc,deleteField } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAgq38ay3TXdY5Ily5pobcCAXxGNe7A-wQ",
  authDomain: "wad-project-f3ec0.firebaseapp.com",
  projectId: "wad-project-f3ec0",
  storageBucket: "wad-project-f3ec0.appspot.com",
  messagingSenderId: "220264558494",
  appId: "1:220264558494:web:475684e268fa655215308f",
  measurementId: "G-1H6J376K8X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
 

    // ...
  } else {
    // User is signed out
    // ...
  }
});

async function addDocument(param){
    var ref = collection(db, "test");
    const docRef = await addDoc(
      ref, param 
      /*{
        testing: "Test"
      }*/
    )
    .then(()=>{
      alert("data added successfully")
    })
    .catch((error)=>{
      alert("Unsuccessfuly")
    })
  }

  //update user data
async function addUser(userId, param){
var ref = doc(db, "Users", userId);
const docRef = await setDoc(
    ref, param 
    /*{
    testing: "Test"
    }*/
)
.then(()=>{
    alert("data added successfully")
})
.catch((error)=>{
    alert("Unsuccessfuly")
})
}

async function addTotalUsers(param){
var ref = doc(db, "TotalUsers", "Users");
const updates = await updateDoc(ref, {
    users: arrayUnion(param)
})
.then(()=>{
    alert("updated total successfully")
    window.location.replace("./sendFriend.html");
})
.catch((error)=>{
    alert("Unsuccessfuly")
})
}

  //sign up function
function signup(){
var friends = [];
var email = document.getElementById("email").value;
var password = document.getElementById("signupPassword").value;
var confirm = document.getElementById("confirm").value;
var username = document.getElementById("username").value;
if(confirm != password){
    return
}
createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
    // Signed in 
    console.log("signed up")
    const user = userCredential.user;
    var paramaters = {
    Username: username,
    Friends: friends,
    TotalTime: 0,
    PastScores: {}
    }
    var paramTotal = {
    [username]:user.uid
    }
    addUser(user.uid, paramaters);
    // ...
    addTotalUsers(paramTotal);
})
.catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
});
}
 

document.getElementById("signup").addEventListener("click", signup);
