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
        if (body.locations != 0 && body.parking_listings != undefined) {
            for (var i = 0; i < body.parking_listings.length; i++) {
                var garage = {
                    "id"         : body.parking_listings[i].location_id,
                    "latitude"   : body.parking_listings[i].lat,
                    "longitude"  : body.parking_listings[i].lng,
                    "garageJson" : body.parking_listings[i]
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
        knex('queue').update({done: true}).where({id: query.id}).then();
    })
};


function processQueue() {
    knex('queue').whereNot({done: true}).then(function(queries) {
        for (var i = 0; i < queries.length; i++) {
            if (queries[i].query == "undefined" || typeof(queries[i].distance) == 'string') {queries[i].done = true; break};
            garageSearch(queries[i], function(result) {});
        }
    }).catch(function(err){console.log(err)});
}


setInterval(processQueue,2000);

module.exports = {
    processQueue : processQueue
}

console.log("┌-----------------┐\n| Worker's online |\n└-----------------┘")