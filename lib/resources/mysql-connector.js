/**
 * Wraps a mysql jdbc connector for easy javascript access.
 *
 * 
 */
namespace('bighub.connector.mysql');


importPackage(java.sql);
/**
 * Establishes a connection to a mysql database.
 *
 * @param {*} options
 *    url {string} a database url of the form jdbc:subprotocol:subname
 *    user {string=} a database user on whose behalf the connection is being made
 *    password {string=} the user's password
 *    properties {*=} a hash or arbitrary string key/value pairs as connection arguments.
 */
bighub.connector.mysql.Connection = function (options) {
	
	/*
	 * Construction logic
	 */
	this.connection = null;
	
	var user = options.user || options.properties.user || '';
	var password = options.password || options.properties.password || '';
	
	var properties = new Properties();
	if (user !== '') {
		properties.put('user', user);
	}
	if (password !== '') {
		properties.put('password', password);
	}
	
	options.properties.user = undefined;
	options.properties.password = undefined;
	
	for (var p in options.properties) {
		properties.put(p, options.properties[p]);
	}
	
	connection = Connection.getConnection(options.url, properties);
	
	/*
	 *
	 */
	
}