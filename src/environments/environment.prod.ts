export const environment = {
  production: false,
  googleWebClientId: '201259008916-6t19tnn8a88kmeeage0vprvn4t6vbto8.apps.googleusercontent.com',
  actionCodeSettings: {
    // Your redirect URL
    url: 'http://localhost:8100/login',
    handleCodeInApp: true,
    dynamicLinkDomain: 'todolistuga.page.link',
    iOS: {
      dynamicLinkDomain: 'todolistuga.page.link',
      bundleId: 'uga.open.todolist'
    },
    android: {
      dynamicLinkDomain: 'todolistuga.page.link',
      packageName: 'uga.open.todolist'
    }
  }
};

export const firebaseConfig = {
  apiKey: "AIzaSyCZz7ONaBOTGKbRuGJk2hr0XmNFzzH7vSU",
  authDomain: "todolist-uga.firebaseapp.com",
  databaseURL: "https://todolist-uga.firebaseio.com",
  projectId: "todolist-uga",
  storageBucket: "todolist-uga.appspot.com",
  messagingSenderId: "201259008916",
  appId: "1:201259008916:web:85afd7c2943a39f4258581",
  measurementId: "G-616NKZL5XG"
};