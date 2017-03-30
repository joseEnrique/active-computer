var request = require('request');
var config = require('./config');
var requestpall = require('governify-tester').doRequests;
var moment = require('moment');
const fs = require('fs');



objectRan = generateObject()
var logjson = JSON.parse(fs.readFileSync('./samplelog.json', 'utf8').replace('{{date}}', objectRan.date).replace('{{method}}', objectRan.methods)
    .replace('{{tenant}}', objectRan.tenant).replace('{{account}}', objectRan.account).replace('{{resource}}', objectRan.resource));
console.log(logjson.sla);

requestpall("http://" + config.elasticsearch.ip + "/event/log/", "POST", 3000, logjson);






function generateObject() {
    var account = ["autumn@gmail.com", "hidden@gmail.com", "bitter@gmail.com", "misty@gmail.com", "silent@gmail.com", "empty@gmail.com", "dry@gmail.com",
            "dark@gmail.com", "summer@gmail.com", "icy@gmail.com", "delicate@gmail.com", "quiet@gmail.com", "white@gmail.com", "cool@gmail.com", "spring@gmail.com",
            "winter@gmail.com", "patient@gmail.com", "twilight@gmail.com", "dawn@gmail.com", "crimson@gmail.com", "wispy@gmail.com", "weathered@gmail.com",
            "blue@gmail.com", "billowing@gmail.com", "broken@gmail.com", "cold@gmail.com", "damp@gmail.com", "falling@gmail.com", "frosty@gmail.com", "green@gmail.com"
        ]

        ,
        tenant = ["tenant1", "tenant6", "tenant4", "tenant3", "tenant2"],

        resource = ["/api/pets", "/api/pets", "/api/pets", "/api/pets/dogs", "/api/pets/cats", "/api/pets/snakes", "/api/pets"],

        methods = ["GET", "POST", "DELETE", "GET", "HEAD", "GET"];

    obj_rand = {
        account: account[Math.floor(Math.random() * (account.length - 1))],
        tenant: tenant[Math.floor(Math.random() * (tenant.length - 1))],
        resource: resource[Math.floor(Math.random() * (resource.length - 1))],
        methods: methods[Math.floor(Math.random() * (methods.length - 1))],
        date: moment().toISOString()

    }


    return obj_rand;
}
