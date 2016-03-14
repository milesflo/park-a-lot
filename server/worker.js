var knex = require("./../db/knex.js");
var dateFormat = require('dateformat');


function processQueue() {
    knex('queue').whereNot({done: true}).then(function(queries) {
        for (var i = 0; i < queries.length; i++) {
                console.log("hello", queries[i]);
            eventfulSearch(queries[i], function(result) {
            });
        }
    }).catch(function(err){console.log(err)});
}

setInterval(processQueue,1000);

module.exports = {
    processQueue   : processQueue
}
