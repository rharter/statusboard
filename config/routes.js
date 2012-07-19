
var register = bighub.router.register;

// inline handler routing
// register('/', function() {
// 		return '<a href="/greet">Greeter</a>';
// 	}
// );

// standard method routing
register('/greet', controllers.greeter.index, 'GET');

// parameterized routing
register('/greet/:name', controllers.greeter.greet, 'GET');

// multiple method routing
register('/greet/:name/edit', controllers.greeter.index, ['GET', 'POST']);

register('/define/:word', controllers.greeter.define, 'GET');

/*
 * Weather
 */
register('/weather/current', controllers.weather.current, 'GET');

/*
 * Twitter
 */
register('/twitter/search', controllers.twitter.search, 'GET');

register('/notes', controllers.notes.list, 'GET');

register('/note/new', controllers.notes.new, 'GET');
register('/note/new', controllers.notes.create, 'POST');

register('/note/:id', controllers.notes.show, 'GET');
