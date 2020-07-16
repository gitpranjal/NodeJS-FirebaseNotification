var admin = require('./firebase-config').admin
var sql = require('mssql');
var fs = require('fs')
//2.
var config = {
    server: '***',
    database: '***',
    user: '***',
    password: '****'
};
//3.
function loadMessages() {
    //4.
    var dbConn = new sql.ConnectionPool(config);
    //5.
    dbConn.connect().then(function () {
        //6.
        var request = new sql.Request(dbConn);
        var query = fs.readFileSync('query.sql').toString()
	      console.log("Checking for pending messages")
        request.query(query)
        .then(function (recordSet) {
            if(recordSet["recordset"].length != 0)
            	 { console.log("New messages with pending status found as shown below:")
            		for(row of recordSet["recordset"])
              		{
              		// console.log(row["ANDROID_TOKEN"])
              		var message = { notification: {
                                                title: "Hello",
                                                body: "Hello" } }

              		var notification_options = { priority: "high", timeToLive: 60 * 60 * 24 };

              		var registrationToken = row["ANDROID_TOKEN"].toString()
              		admin.messaging().sendToDevice(registrationToken, message, notification_options)
                     .then( response => {console.log("Notification sent successfully")})
              		   .catch(error => {console.log("Notification couldn'y be sent: "+error)} )
                   }
            		}
    		
          	else
          	  {
            		console.log("No new message")
                
              }
                   dbConn.close();
                  
              })
        .catch(function (err) {
                  console.log("Error in querying or after querying action block")
                  console.log(err);
                  dbConn.close();
              });
          }).catch(function (err) {
              //9.
              console.log("ERROR CONNECTING TO DATABASE :");
              console.log(err)
          });
      }
//10.

setInterval(loadMessages, 3000)



