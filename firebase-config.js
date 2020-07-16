var admin = require("firebase-admin");

var serviceAccount = require("./***.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://xxx.com"
})

module.exports.admin = admin
