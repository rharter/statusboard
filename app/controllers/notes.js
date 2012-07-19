namespace('controllers.notes');

controllers.notes.list = function (request, response) {
	// Get a mongo object
	var mongo = new storage.mongo.mongo('staff.mongohq.com', 10074);
	out.println("mongo: " + JSON.stringify(mongo));
	
	// Get the database
	var db = mongo.getDB('notes-development');
	out.println("db: " + db);
	
	// Authenticate against the database
	var auth = db.authenticate('dev', 'dev');
	out.println("auth result: " + auth);
	
	// Get the notes collection
	var notes_coll = db.getCollection('notes');
	out.println("notes collection: " + notes_coll);
	
	// Get all of the notes
	var notes = [];
	var all = notes_coll.find();
	while(all.hasNext()) {
		notes.push(all.next());
	}
	
	var view = {
		notes: notes
	};
	
	return ui.mustache.render('notes/index.html', view);
}

controllers.notes.show = function (request, response) {
	var mongo = new storage.mongo.mongo('staff.mongohq.com', 10074);
	var db = mongo.getDB('notes-development');
	db.authenticate('dev', 'dev');
	
	var notes_coll = db.getCollection('notes');
	var note = notes_coll.findOne({_id:request.params.id});
	
	return ui.mustache.render('notes/show.html', note);
}

controllers.notes.new = function (request, response) {
	return ui.mustache.render('notes/new.html');
}

controllers.notes.create = function (request, response) {
	var note = {
		public: ['on', 'checked', true].indexOf(request.params.public) > -1,
		content: request.params.content,
		name: request.params.name
	};
	
	var mongo = new storage.mongo.mongo('staff.mongohq.com', 10074);
	var db = mongo.getDB('notes-development');
	db.authenticate('dev', 'dev');
	
	var notes_coll = db.getCollection('notes');
	coll.insert(note);
	
	return "Saved.";
}