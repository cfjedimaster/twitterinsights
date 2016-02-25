var request = require('request');

var credentials = {};

function getURL() {
	return 'https://'+credentials.username+':'+credentials.password+'@'+credentials.url+'/api/v1/';	
}

/*
Given a term, X, I will call TI to get sentiment for the term. To do so, I make four calls
so I can get a count for positive, negative, neutral, and ambivalent
*/
var sentiments = ['positive', 'negative', 'neutral', 'ambivalent'];
function getSentiment(term) {

	var promises = [];
	
	sentiments.forEach(function(s) {
		var p = new Promise(function(fulfill, reject) {
			request.get(getURL()+'messages/count?q='+encodeURI(term)+' AND sentiment:'+s, function(error, response, body) {
				
				if(error) console.error(error);
				fulfill(JSON.parse(body));	
			});
		});
		promises.push(p);
	});
	
	return new Promise(function(fulfill, reject) {
		Promise.all(promises).then(function(results) {
			var metaResult = {
				positive:results[0].search.results,
				negative:results[1].search.results,
				neutral:results[2].search.results,
				ambivalent:results[3].search.results
			};
			fulfill(metaResult);	
		});
	});
	
}

/*
deepSentiment isn't the best name, but this method handles:
- core sentiment for the term
- sentiment for people with a high follower count (locked to 5k)
- sentiment for people with children
- sentiment for married people
- sentiment in year X (not done yet)

I basically rewrote getSentiment above and it's no longer used as is, but I kept it as my
first draft/simpler API.
*/
function deepSentiment(term) {
	var sentiments = ['positive', 'negative', 'neutral', 'ambivalent'];

	var promises = [];
	
	//first the core stuff
	sentiments.forEach(function(s) {
		var p = new Promise(function(fulfill, reject) {
			request.get(getURL()+'messages/count?q='+encodeURIComponent(term)+' AND sentiment:'+s, function(error, response, body) {
				
				if(error) console.error(error);
				fulfill({scope:'main',sentiment:s,data:JSON.parse(body).search.results});	
			});
		});
		promises.push(p);
	});
	
	//now for high follower count
	sentiments.forEach(function(s) {
		var p = new Promise(function(fulfill, reject) {
			request.get(getURL()+'messages/count?q='+encodeURIComponent(term)+' AND followers_count:5000 AND sentiment:'+s, function(error, response, body) {
				
				if(error) console.error(error);
				fulfill({scope:'high',sentiment:s,data:JSON.parse(body).search.results});	
			});
		});
		promises.push(p);
	});	
	
	//now for people with children
	sentiments.forEach(function(s) {
		var p = new Promise(function(fulfill, reject) {
			request.get(getURL()+'messages/count?q='+encodeURIComponent(term)+' AND has:children AND sentiment:'+s, function(error, response, body) {
				
				if(error) console.error(error);
				fulfill({scope:'children',sentiment:s,data:JSON.parse(body).search.results});	
			});
		});
		promises.push(p);
	});	

	//now for married people
	sentiments.forEach(function(s) {
		var p = new Promise(function(fulfill, reject) {
			request.get(getURL()+'messages/count?q='+encodeURIComponent(term)+' AND is:married AND sentiment:'+s, function(error, response, body) {
				
				if(error) console.error(error);				
				fulfill({scope:'married',sentiment:s,data:JSON.parse(body).search.results});	
			});
		});
		promises.push(p);
	});	
	
	//last year
	var lastYear = new Date().getFullYear()-1;
	var dateFilter = 'posted:'+lastYear+'-01-01,'+lastYear+'-12-31';
	
	sentiments.forEach(function(s) {
		var p = new Promise(function(fulfill, reject) {
			request.get(getURL()+'messages/count?q='+encodeURIComponent(term)+' AND '+dateFilter+' AND sentiment:'+s, function(error, response, body) {
				
				if(error) console.error(error);
				fulfill({scope:'lastyear',sentiment:s,data:JSON.parse(body).search.results});	
			});
		});
		promises.push(p);
	});	
				
	return new Promise(function(fulfill, reject) {
		Promise.all(promises).then(function(results) {

			console.log('deep query done');
			console.dir(results);
			
			var metaResult = {};
			results.forEach(function(r) {
				var append = '';
				if(r.scope !== 'main') {
					append = '_'+r.scope;
				}
				metaResult[r.sentiment+append] = r.data;
			});

			fulfill(metaResult);	
			
		});
	});	
}
	
module.exports = {

	setCredentials:function(username,password,url) {
		credentials = {username:username, password:password,url:url};
	},
	getSentiment:getSentiment,
	deepSentiment:deepSentiment
};