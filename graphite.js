var dgram = require('dgram');

var Graphite = function(apiKey) {
	this.apiKey = apiKey;
	this.port = 2003;
	this.host = 'carbon.hostedgraphite.com';

	this.client = dgram.createSocket('udp4');
};

Graphite.prototype.sendMetric = function(name, count, timestamp) {
	var metrics = {
		name: name,
		count: count,
		timestamp: timestamp
	};

	this.sendMetrics([metrics]);
};

Graphite.prototype.sendMetrics = function(metrics) {

	var message = '';
	var apiKey = this.apiKey;

	metrics.forEach(function(metricObject) {
		var key = metricObject.name;
		var value = metricObject.count;
		var timestamp = metricObject.timestamp || '';

		message += apiKey + '.' + key + ' ' + value + ' ' + timestamp + '\n';
	});

	message = new Buffer(message);

	this.client.send(message, 0, message.length, this.port, this.host);
};

module.exports = Graphite;
