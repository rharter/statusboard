namespace('storage.mongo');

storage.mongo.mongo = function(host, port) {
	this.host = host || 'localhost';
	this.port = port || 27017;
	this._mongo = new Packages.com.mongodb.Mongo(this.host, this.port);
}

storage.mongo.mongo.prototype = {
	_mongo: null,
	dropDatabase: function (db_name) {
		this._mongo.dropDatabase(db_name);
	},
	getDatabaseNames: function () {
		return this._mongo.getDatabaseNames().toArray();
	},
	getDB: function (db) {
		return new storage.mongo.mongo_db(this._mongo.getDB(db));
	},
	toJSON: function () {
		return {host: this.host, port: this.port};
	}
}