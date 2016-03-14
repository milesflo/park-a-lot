var knex        = require("./../db/knex.js"),
    dateformat  = require('dateformat'),
    dotenv      = require('dotenv');



function processQueue() {
    knex('queue').whereNot({done: true}).then(function(queries) {
        for (var i = 0; i < queries.length; i++) {
            console.log("Processing:", queries[i]);
            eventfulSearch(queries[i], function(result) {
            });
        }
    }).catch(function(err){console.log(err)});
}

setInterval(processQueue,1000);

module.exports = {
    processQueue   : processQueue
}
