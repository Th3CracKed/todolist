# todolist
- Run App on debug mode web
ionic serve

- Run App on debug mode Android
ionic cordova run android --device -l --debug


ionic cordova plugin add cordova-plugin-firebase-dynamiclinks --variable APP_DOMAIN='todolist-uga.firebaseio.com' --variable PAGE_LINK_DOMAIN='todolistuga.page.link' --variable APP_PATH="/login"