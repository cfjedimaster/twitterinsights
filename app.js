/*eslint-env node*/

var express = require('express');

var twitterInsights = require('./twitterinsights');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

var vcapLocal = null;
try {
  vcapLocal = require('./vcap-local.json');
  console.log('Loaded local VCAP');
} catch (e) {
  console.error(e);
}

// get the app environment from Cloud Foundry, defaulting to local VCAP
var appEnvOpts = vcapLocal ? {
  vcap: vcapLocal
} : {};
var appEnv = cfenv.getAppEnv(appEnvOpts);

//Set credentials to TI
twitterInsights.setCredentials(appEnv.services.twitterinsights[0].credentials.username, appEnv.services.twitterinsights[0].credentials.password,appEnv.services.twitterinsights[0].credentials.host);

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	console.log("server starting on " + appEnv.url);
});

app.get('/analyze', function(req, res) {
	var term = req.query.term;
	if(!term) return res.end();
		

	twitterInsights.deepSentiment(term).then(function(result) {
		res.send(result);
	});
});

app.get('/test', function(req, res) {
	
	twitterInsights.deepSentiment(req.query.term).then(function(result) {
		
		var mainTotal = result.positive + result.negative + result.neutral + result.ambivalent;
		var mainPerc = {
			positive: Math.round(result.positive/mainTotal*100),
			negative: Math.round(result.negative/mainTotal*100),
			neutral: Math.round(result.neutral/mainTotal*100),
			ambivalent: Math.round(result.ambivalent/mainTotal*100)
		};

		var highTotal = result.positive_high + result.negative_high + result.neutral_high + result.ambivalent_high;
		var highPerc = {
			positive: Math.round(result.positive_high/highTotal*100),
			negative: Math.round(result.negative_high/highTotal*100),
			neutral: Math.round(result.neutral_high/highTotal*100),
			ambivalent: Math.round(result.ambivalent_high/highTotal*100)
		};

		var marriedTotal = result.positive_married + result.negative_married + result.neutral_married + result.ambivalent_married;
		var marriedPerc = {
			positive: Math.round(result.positive_married/marriedTotal*100),
			negative: Math.round(result.negative_married/marriedTotal*100),
			neutral: Math.round(result.neutral_married/marriedTotal*100),
			ambivalent: Math.round(result.ambivalent_married/marriedTotal*100)
		};

		var kidsTotal = result.positive_children+ result.negative_children + result.neutral_children + result.ambivalent_children;
		var kidsPerc = {
			positive: Math.round(result.positive_children/kidsTotal*100),
			negative: Math.round(result.negative_children/kidsTotal*100),
			neutral: Math.round(result.neutral_children/kidsTotal*100),
			ambivalent: Math.round(result.ambivalent_children/kidsTotal*100)
		};
			
		console.log('in the result handler: '+JSON.stringify(result));
		var resultString = `<pre>
result for your term:

${JSON.stringify(mainPerc,null,'\t')}

${JSON.stringify(highPerc,null,'\t')}

${JSON.stringify(marriedPerc,null,'\t')}

${JSON.stringify(kidsPerc,null,'\t')}

		</pre>
		`;
		res.send(resultString);
	});
});