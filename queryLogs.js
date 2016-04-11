// queryLogs.js
// solutions to Assignment 4
// Carleton University COMP 2406, 2016W

var fs = require('fs');
var mc = require('mongodb').MongoClient;
var db, logs;

var matches;
var argRE = /--(\w+)=(.+)/;

var options = {
    results: '',
    maxcount: '0',
    service: '',
    message: ''
}

for (i=2; i<process.argv.length; i++) {
    matches = process.argv[i].match(argRE);

    if (matches) {
        options[matches[1]] = matches[2];
    }
}

var reportResults = function(err, results) {
    var lines = [];

    if (err) {
	throw err;
    }

    results.forEach(function(entry) {
	var s = [entry.date, entry.time, entry.host, entry.service + ":",
		 entry.message];
	lines.push(s.join(' '));	
    });

    if (options.results ==='') {
	console.log(lines.join('\n'));
    } else {
	fs.writeFileSync(options.results, lines.join('\n'), 'utf-8');
    }
    db.close();
}

var connectCallback = function(err, returnedDB) {
    if (err) {
	throw err;
    }

    db = returnedDB;
    logs = db.collection('logs');
    logs.find({service: {$regex: options.service},
	       message: {$regex: options.message}}
	     ).limit(parseInt(options.maxcount)).toArray(reportResults);
}

mc.connect('mongodb://localhost/log-demo', connectCallback);
