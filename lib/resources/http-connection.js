/**
 * Wraps a java.net.HTTPURLConnection
 */

namespace('bighub.net.urlconnection');

/**
 * Executes an HTTP Url request defined by options.
 *
 * @param {*} options
 *    url {string}               the url against which the request should be made
 *    method {string}            the HTTP verb to execute
 *    data {*}                   a key/value hash of the request parameters
 *    complete {f(data, status)} a function to execute upon request completion
 *    content_type {string}      the content type of the request body
 *    accepts {string}           the content type that tells the server what type
 *                               of response it will accept in return.
 *    headers {{}}               a hash of extra headers to be sent
 *    timeout {number}           the timeout of the request in seconds
 *    status_code {{}}           A map of functions to handle different response codes
 */
bighub.net.urlconnection.request = function(options) {
	var connection_classes = JavaImporter(Packages.java.net,
	                                      Packages.java.util);
	
	with (connection_classes) {
		var url = new URL(options.url);
		var connection = url.openConnection();
		
		// configure the connection
		connection.setRequestMethod(options.method || 'GET');
		connection.setRequestProperty('Content-Type', options.content_type || 'text/plain');
		connection.setRequestProperty('Accepts', options.accepts || '*');
		connection.setReadTimeout(options.timeout ? options.timeout * 1000 : 
				connection.getReadTimeout());
		
		for (var p in options.headers) {
			connection.setRequestProperty(p, options.headers[p]);
		}
		
		// Make the connection
		connection.connect();
		
		var status = connection.getResponseCode();
		var output = null;
		
		var is = connection.getInputStream();
		var data = new Scanner(is).useDelimiter("\\A").next();
		
		if (options.status_code) {
			var handler = options.status_code[status];
			
			if (handler) {
				handler(data);
			}
		} else {
			options.complete(data, status);
		}
	}
}