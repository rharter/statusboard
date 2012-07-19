namespace('storage.mongo');

storage.mongo._support = {
	ensureId: function (o) {
		if (typeof o === 'object') {
			if (o._id) {
				o._id = this.createObjectId(o._id.toString());
			} else {
				o._id = this.createObjectId();
			}
		} else {
			o = { _id: o.toString() };
		}
		return o;
	},
	createDbObject: function (obj, ensure_id) {
		obj = obj || {};
		return new Packages.com.mongodb.BasicDBObject(ensure_id ? this.ensureId(obj) : obj);
	},
	extend: function (dst, src, deep) {
		for (var k in src) {
			var v = src[k];
			if (deep && typeof v === 'object') {
				v = storage.mongo._support.extend(typeof v.length === 'number' ? [] : {}, v, true);
			}
			dst[k] = v;
		}
		return dst;
	},
	createObjectId: function (id) {
		var oid;
		var object_id = Packages.org.bson.types.ObjectId;
		
		if (!id) {
			oid = new object_id;
		} else if (object_id.isValid(id)) {
			oid = new object_id(id);
		} else {
			throw id + " is not a valid ObjectId.";
		}
		
		return oid;
	}
}