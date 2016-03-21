var knex        = require("./../db/knex.js"),
    dateformat  = require("dateformat"),
    dotenv      = require("dotenv"),
    http        = require("http"),
    request     = require("request")

    dotenv.load();


garageSearch = function(query, done) {

    request({
        url: "http://api.parkwhiz.com/search/?destination=" + query.query + "&distance=" + query.distance + "&key="+process.env.keyParkWiz,
        json: true
    }, function (error, response, body) {
        console.log(body);
        if (body.location != 0 && body.parking_listings != undefined) {
            for (var i = 0; i < body.parking_listings.length; i++) {
                var garage = {
                    "latitude"   : body.parking_listings[i].latitude,
                    "longitude"  : body.parking_listings[i].longitude,
                    "eventJson"  : body.parking_listings[i]
                };
                knex("garages").insert(garage).then(function(response) {
                    //console.log("hello");
                    //console.log(response);
                }).catch(function(response) {
                    //console.log("goodbye");
                    //console.log(response);
                });
            }
        }
        knex('queue').update({done: true}).where({id: query.id}).then(function(){ console.log ("beepboop")});
    })
};


function processQueue() {
    knex('queue').whereNot({done: true}).then(function(queries) {
        for (var i = 0; i < queries.length; i++) {
            if (queries[i].query == "undefined") {queries[i].done = true; break}
                console.log("Processing:", queries[i]);
                garageSearch(queries[i], function(result) {
                });
        }
    }).catch(function(err){console.log(err)});
}


setInterval(processQueue,1000);

module.exports = {
    processQueue   : processQueue
}

console.log("┌---------------┐\n|Worker's online|\n└---------------┘")