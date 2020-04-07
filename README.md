# Todolist
![Build apk](https://github.com/Th3CracKed/todolist/workflows/Build%20apk/badge.svg)
![Build](https://github.com/Th3CracKed/todolist/workflows/Build/badge.svg)

- Run App on debug mode web
ionic serve

- Run App on debug mode Android
ionic cordova run android --device -l --debug


ionic cordova plugin add cordova-plugin-firebase-dynamiclinks --variable APP_DOMAIN='todolist-uga.firebaseio.com' --variable PAGE_LINK_DOMAIN='todolistuga.page.link' --variable APP_PATH="/login"



Les éléments attendus sont les suivants :
Le lien de votre projet Git (merci de vérifier si nous y avons accès, nos identifiants ont été partagés sur le classroom).
Votre APK, à héberger soit sur votre forge, soit sur le serveur HTTP dans Firebase.
Nous ajouter dans votre projet Firebase (même si à la limite, nous pourrons faire un partage d'écran à ce sujet).







Projet développement mobile M2GI TODOLIST
=========================================

Group 4 / Git username
---------------------

Wampach Sylvestre: Syl-47
DRIOWYA Abdelghafour:  Th3CracKed



Getting Started
===============

## Installing prebuilt APK

Find the latest APK in the `Build APK` folder.
Copy paste APK file into your mobile device. Locate the .apk file. Install it following the steps.
After the installation run the app from the app launcher.

## Web browser

Webside link: https://todolist-uga.web.app/



Features
========

  * Support Desktop / Android/ Ios
  * Google authentication
  * Facebook authentication
  * Register / Create new account
  * Remember session (Remember me)
  * Passwordless authentication
  * Fingerprint quick login after app relaunch
  * Help pages on initial launch
  * Shared todo list by email
  * Per user list sharing autorization (readonly / can edit)
  * Add new todolist
  * Delete todolist
  * Rename todolist
  * Edit todolist color
  * Filter todolists with search bar
  * Add new task in todolist
  * Delete task (Swipe)
  * Check / uncheck task
  * Edit user account profil data
    - Edit app theme
  * Take picture with the camera for custom user profil picture (**Mobile only**)
  * Load picture from device gallery
    - Resize image
    - Image to base64
  * Offline list and task creation
  * Forms & errors handling
  * Notifications
  * Vibrator


Installation
============

How to install the project on your local machine from the source code.

## Build from source ##


### Requirements
    ionic-v4
    android-sdk
    npm
    angular v8

### Building

For desktop:
```bash
    git clone url
    npm install -g ionic
    npm install
    ionic serve

```

For android device:
```bash
    ionic build
    ionic cordova build android
    ionic cordova run android
    ...
    
    #debug mode
    ionic cordova run android --device -l --debug
    android open
```

Running the tests
=================



Deployment
==========


Built With
==========

 * [Ionic v4 framework](https://ionicframework.com/)
 * [Angular 8](https://angular.io/)
