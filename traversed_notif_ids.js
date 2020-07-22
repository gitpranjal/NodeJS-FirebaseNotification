var fs = require('fs')
try {
    var data = fs.readFileSync('/home/pranjal/node_mysql/mssql_live_notification/traversed_notif_ids.txt', 'utf8');
    data = data.toString().trim().split(' ');
    //console.log(data.includes('66984####dbZ5xSAFly4:APA91bFRJe6Swoh1cm3BscGzSvf23GV1rdEb6jxiLpA6uK2YIR4mT9kKojUwN6r4CWP8ZBoiGWFqCTwyJmvYN0DQMBPB7bge2gyXAAOujn3HrQwLlxHo7_M6ZtyP8dmOCeFa6QrdMKOR'))
    module.exports = data
} catch(e) {
    console.log('Error:', e.stack);
    module.exports =[]
}



