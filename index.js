var sql = require('mssql')
var admin = require('/home/pranjal/node_mysql/mssql_live_notification/firebase-config').admin
var sql = require('mssql');
var fs = require('fs')

var clientsDBconfig = {
  server: '**',
  database: '**',
  user: '**',
  password: '**'

}

var notification_time_offset_minutes = 15
var notification_time_offset_hours = 0
var notification_time_offset_days = 1

var sent_notification_ids = require('/home/pranjal/node_mysql/mssql_live_notification/traversed_notif_ids.js')
var currentTime = new Date()
currentTime.setMinutes((currentTime.getMinutes() - notification_time_offset_minutes)%60)
currentTime.setHours((currentTime.getHours() - notification_time_offset_hours)%24)
currentTime.setDate(currentTime.getDate() - notification_time_offset_days)

var notification_start_datetime = new Date(currentTime.toString().split('GMT')[0]+' UTC').toISOString()

var query = eval('`'+fs.readFileSync('/home/pranjal/node_mysql/mssql_live_notification/query.sql').toString()+'`')


var T = 1000*30

var notify = function()
{		console.log("############ Notifying")

		//setTimeout(() =>{clientsDBConnection.close() }, T-1000)
		var clientsDBConnection = new sql.ConnectionPool(clientsDBconfig)
		clientsDBConnection.connect()
		.then(function(){

		  

		  var client_info_request = new sql.Request(clientsDBConnection)
		  var num_databases_connected =0
		  client_info_request.query('SELECT  client_id, client_name, CLIENT_CODE , dbname, DB_USER_NAME, DB_PWD  from Core_client_mt')
		  .then(function(clientInfoRecords){
		      

		      clientInfoRecords["recordset"].forEach(function(config)
		      {

		        if(!config["dbname"] || !config["DB_USER_NAME"])
		          return
		        
		        var new_message = true
		        
		        
		        // var database_config = {
		        //                         "server" : clientsDBconfig["server"],
		        //                         "database" : config["dbname"],
		        //                         "user" : config["DB_USER_NAME"],
		        //                         "password" : config["DB_PWD"],
		        //                       }

		        var database_config = {
		                                "server" : clientsDBconfig["server"],
		                                "database" : "**",
		                                "user" : "**",
		                                "password" : "**",
		                              }


		        var dbConn = new sql.ConnectionPool(database_config)
		        //setTimeout(() =>{dbConn.close() }, T-1000)
		        dbConn.connect()
		          .then(function(){
		         

		            var request = new sql.Request(dbConn)
		 
		                var row_num = 0
		                request.query(query)
		                  .then(function(recordSet){
		                    
		                
		                    recordSet["recordset"].forEach(function(row)
		                    {

		                      if(sent_notification_ids.includes((row["NOTIF_ID"]+"####"+row["ANDROID_TOKEN"]).toString()))
                                  { 
                                    console.log("Message with notification_id: "+row["NOTIF_ID"]+" already sent to token "+ row["ANDROID_TOKEN"])
                                    return 
                                  }

                              fs.appendFile("/home/pranjal/node_mysql/mssql_live_notification/traversed_notif_ids.txt", (row["NOTIF_ID"]+"####"+row["ANDROID_TOKEN"]).toString()+" " , (error) => { if (error) throw error})

		                      sent_notification_ids.push((row["NOTIF_ID"]+"####"+row["ANDROID_TOKEN"]).toString())

		                      
		                      var androidResgistrationToken = row["ANDROID_TOKEN"].toString()
		                      var iosResgistrationToken = row["IOS_TOKEN"].toString()
		                      var message = {
		                                "tokens": [androidResgistrationToken, iosResgistrationToken],
		                                "notification": {
		                                          "title":"Notification",
		                                          "body": row["NOTIF_MSG"]
		                                                 },
		                                "data": {
		                                      "title":"Notification",
		                                      "body": row["NOTIF_MSG"]
		                                         }

		                                    }
		                      admin.messaging().sendMulticast(message)
		                        .then(response => { 

		                                            console.log("Connecting to database: "+config["dbname"]+ " to send new messages")
		                                            
		                                            console.log("Notification sent successfully"+response)
		                                            console.log("MEssage sent: "+row["NOTIF_MSG"])
		                                            console.log("Android token: "+row["ANDROID_TOKEN"])
		                                            console.log("IOS token: "+row["IOS_TOKEN"])
		                                      
		                                            
		                 
		                                             //console.log(sent_notification_ids)
		                                          
		                                            
		                                          })
		                        .catch(error => {console.log("Notification couldn't be sent: "+error)
		                        					dbConn.close()
		                        					dbConn.connect()
		                    					})
		                      

		                      
		                    })
		                    
		                  })
		                  .catch(function(error){console.log("###Query result in database named: "+config["database"]+" unsuccessful with error: "+error)})

		             
		          })
		          .catch(function(error){console.log("####Couldn't connect to database"+config["dbname"]+" with error"+ error)

		      							})
		         
		       
		      })


		  })
		})
		    
		.catch(function(error){console.log("Couldn't connect to Apps_Cloud_Staging_test with error: "+error)})
}

notify()
