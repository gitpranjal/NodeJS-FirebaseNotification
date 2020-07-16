# NodeJS-FirebaseNotification
Repository for code to send backend notifications from MSSQL server database to android app using node js and firebase.
Uses polling method to acheive regular montitoring of the database for changes at regular intervals. After every 5 seconds, it executes an SQL query to look for rows with specific attribute values. if found, the notifications for such rows are sent to the android applications

Following are the steps:
1. Login to google firebase. Register your android app to which notification is to be sent
2. Go to your registered app's setting in your firebase account and click on services account tab.
3 Click on create new service account and then click on generate new key button. This will download a JSON file which will be required to createa configuration file to configure your nodejs application with firebase
4. Initialize a node project. Install firebase-admin via **npm install firebase-admin**. Connect your node application with whatever database you use. 
5 Create a firebase-config.js file as shown in the code. This file exports the firebase admin object, which has been configured with your app's atabase and credentials
6 Finally create your main index.js file to use this admin object to send notifications to your android app as shown in the code.
