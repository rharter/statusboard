namespace('storage.mongo')

storage.mongo.mongo_db = function (db) {
	this._db = db;
	
	var self = this;
    this.javaMethods.forEach(function (m) {
        self[m] = function() {
                if (arguments[0])
                    return db[m](arguments);
                else
                    // If there are no arguments we can't pass null, because it
                    // is considered an object and doesn't translate properly
                    // in Java...
                    return db[m]();
            }
    });
}

storage.mongo.mongo_db.prototype = {
	_db: null,
	host: null,
	port: null,
	javaMethods: [
		"addUser",
		"dropDatabase"
	],
	authenticate: function (user, pass) {
		return this._db.authenticate(user, (new Packages.java.lang.String(pass)).toCharArray());
	},
	command: function (cmd) {
		return this._db.command(new Packages.com.mongo.BasicDBObject(cmd));
	},
	createCollection: function (name, obj) {
		return new storage.mongo.collection(this._db.createCollection(name, Packages.com.mongo.BasicDBObject(obj)), this);
	},
	eval: function (code, args) {
		return this._db.eval(code, args) || {};
	},
	getCollection: function (name) {
		return new storage.mongo.collection(this._db.getCollection(name), this);
	},
	getCollectionFromFull: function (full_name) {
		return this._db.getCollectionFromFull(full_name, this);
	},
	getCollectionNames: function () {
		return this._db.getCollectionNames().toArray().slice();
	},
	getLastError: function() {
		return this._db.lastError || {};
	},
	getName: function () {
		return this._db.getName();
	},
	toJSON: function () {
		return {name: "database"};//this.get_name().toString()};
	},
	toString: function () {
		return this.getName();
	}
}