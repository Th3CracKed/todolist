// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyCZz7ONaBOTGKbRuGJk2hr0XmNFzzH7vSU",
  authDomain: "todolist-uga.firebaseapp.com",
  databaseURL: "https://todolist-uga.firebaseio.com",
  projectId: "todolist-uga",
  storageBucket: "todolist-uga.appspot.com",
  messagingSenderId: "201259008916",
  appId: "1:201259008916:web:85afd7c2943a39f4258581",
  measurementId: "G-616NKZL5XG"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.usePublicVapidKey('BHAdjJpY0Ctj5fYT5KIPkQ7s00t7Qb7HNB2NFPSJCmgJtXc-FD7RqvXI8tzFaE0GXjzFGqEou8t-U0e3DMkVj_U');