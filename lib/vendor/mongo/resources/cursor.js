namespace('storage.mongo');

storage.mongo.cursor = function (cursor) {
	this._cursor = cursor;
	
	var self = this;
    this.javaMethods.forEach(function (m) {
        self[m] = function() {
                if (arguments[0])
                    return cursor[m](arguments);
                else
                    // If there are no arguments we can't pass null, because it
                    // is considered an object and doesn't translate properly
                    // in Java...
                    return cursor[m]();
            }
    });
}

storage.mongo.cursor.prototype = {
	javaMethods: [
		"hasNext",
		"count",
		"curr",
		"length",
		"itcount",
		"numGetMores"
	],
	_cursor: null,
	next: function () {
		var sm = this._cursor.next() || {};
		if (sm) {
            var jsObj = {__proto__: null},
                smKeySet = sm.keySet().toArray().slice();
            for each(var i in smKeySet) {
	        	jsObj[i] = sm.get(i) + "";
            }
            return jsObj;
        } else
            return null;
	},
	hasNext: function () {
		return this._cursor.hasNext();
	},
	limit: function (lim) {
		return new storage.mongo.cursor(this._cursor.limit(lim));
	},
	skip: function (num) {
		return new storage.mongo.cursor(this._cursor.skip(num));
	},
	sort: function (obj) {
		return new storage.mongo.cursor(this._cursor.sort(
				storage.mongo._support.create_db_object(obj)));
	},
	explain: function () {
		return this._cursor.explain() || {};
	},
	toArray: function () {
		var obj = this._cursor.copy().toArray().toArray();
	},
	snapshot: function () {
		this._cursor.snapshot();
		return this;
	},
	batchSize: function (num) {
		return new storage.mongo.cursor(this._cursor.batchSize(num));
	},
	getSizes: function () {
		return this._cursor.getSizes().toArray().slice();
	}
}