// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  databaseURL: "DATABASE_URL",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "Messaging_Sender_ID",
  appId: "APP_ID",
  measurementId: "Measurement_Id"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
