namespace('controllers.greeter');

controllers.greeter.index = function() {
	return "<a href=\"greet/Ryan\">Greet Ryan</a><br/><a href=\"greet/Josh\">Greet Josh</a>";
};

controllers.greeter.greet = function() {
    return "Hello, " + params.name + " Bitches!";
}

controllers.greeter.define = function() {
	bighub.net.urlconnection.request({
		method: 'GET',
		url: "http://www.wordreference.com/definition/space",
		complete: function(data, status) {
			response.setStatus(status);
			response.setContentType('text/html');
			var output = response.getOutputStream();
			output.print(data);
			output.close();
		}
	});
}

