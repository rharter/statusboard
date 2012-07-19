namespace('storage.mongo');

storage.mongo.collection = function (collection, db) {
	if (!db) {
		throw "A database argument is required.";
	}
	
	this._collection = collection;
	this._db = db;
	
	var self = this;
	this.javaMethods.forEach(function (m) {
		self[m] = function() {
			if (arguments[0])
				return collection[m](arguments);
			else
				return collection[m]();
		}
	});
}

storage.mongo.collection.prototype = {
	javaMethods: [
		"ensureIDIndex",
		"getName",
		"getCount",
		"dropIndexes"
	],
	_db: null,
	_dbCommand: function (cmd) {
		return this._db.command(cmd);
	},
	_genIndexName: function (keys) {
		var name = '';
		for (var k in keys) {
			if (name.length > 0) {
				name += '_';
			}
			name += k + '_';
			
			var v = keys[k];
			if (typeof v === 'number') {
				name += v;
			}
		}
		return name;
	},
	_indexCache: null,
	_indexSpec: function(keys, options) {
        var ret = { ns : this.getFullName() , key : keys , name : this._genIndexName( keys ) };
        if (options) {
            var type = typeof(options);
            switch(type) {
                case("string"):
                    ret.name = options;
                    break;
                case("boolean"):
                    ret.unique = true;
                    break;
                case("object"):
                    if ( options.length ) {
                        var nb = 0;
                        for each(var option in options) {
                            if (typeof ( option ) == "string")
                                ret.name = option;
                            else if (typeof(option) == "boolean" && option === true) {
                                if (nb == 0)
                                    ret.unique = true;
                                if (nb == 1)
                                    ret.dropDups = true;
                                nb++;
                            }
                        }
                    }
                    else {
                        storage.mongo._support.extend(ret, options);
                    }
                    break;
                default:
                    throw "Can't handle " + typeof(options) + " as an options argument.";
            }
        }
        return ret;
    },
    getFullName: function () {
	    return this._db.getName() + '.' + this.getName();
    },
    _collection: null,
    count: function () {
    	return this._collection.count();
    },
    drop: function () {
	    this.resetIndexCache();
	    this._collection.dropIndexes();
	    this._collection.drop();
    },
    find: function () {
	    var args = Array.prototype.slice.call(arguments)
	    			.map(function(arg) {
		    			return typeof arg === 'object' ?
		    			storage.mongo._support.createDbObject(arg) : arg;
	    			});
	    return new storage.mongo.cursor(this._collection.find.apply(this._collection, args));
    },
    findOne: function(obj, fields) {
	    var result;
        if (obj) {
            if (typeof obj != "object")
                obj = { "_id": obj };

            result = this._collection.findOne(
                    storage.mongo._support.createDbObject(obj, true),
                    storage.mongo._support.createDbObject(arguments[1])
                );
        } else {
           result = this._collection.findOne();
        }
        if (result) {
            var jsObj = {__proto__: null},
                smKeySet = result.keySet().toArray().slice();
            for each(var i in smKeySet) {
	        	jsObj[i] = result.get(i) + "";
            }
            return jsObj;
        } else
            return null;
    },
    save: function (obj) {
	    var dbo = storage.mongo._support.createDbObject(obj, true);
	    this._collection.save(dbo);
    },
    ensureIndex: function (keys, options) {
	    var name = this._indexSpec(keys, options).name;
	    this._indexCache = this._indexCache || {};
	    if (this._indexCache[name]) {
		    return;
	    }
	    
	    this.createIndex(keys, options);
	    if (this._db.getLastError() === '') {
		    this._index_cache[name] = true;
	    }
    },
    createIndex: function (keys, options) {
	    this._db.getCollection('system.indexes').insert(this._indexSpec(keys, options), true);
    },
    dropIndex: function (index) {
	    if (typeof index === 'object') {
		    index = this._genIndexName(index);
	    }
	    
	    var res = this._dbCommand({deleteIndexes: this.getName(), index: index});
	    this.resetIndexCache();
	    return res;
    },
    getIndexInfo: function () {
	    return this._collection.getIndexInfo() || {};
    },
    insert: function (docs) {
	    var insertable = docs.isArray && docs.isArray() ?
	    				docs.map(function(d) { storage.mongo._support.createDbObject(d, true); }) :
	    				storage.mongo._support.createDbObject(docs, true);
	    this._collection.insert(insertable);
    },
    update: function (criteria, obj) {
	    if (criteria && typeof criteria !== 'object') {
		    criteria = { _id: criteria };
	    }
	    this._collection.update(storage.mongo._support.createDbObject(criteria),
		                        storage.mongo._support.createDbObject(obj));
    },
    resetIndexCache: function () {
	    this._indexCache = {};
	    this._collection.resetIndexCache();
    },
    remove: function (obj) {
	    this._collection.remove(storage.mongo._support.createDbObject(obj));
    }
}