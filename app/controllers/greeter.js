namespace('controllers.greeter');

controllers.greeter.index = function(request, response) {
	return "<a href=\"greet/Ryan\">Greet Ryan</a><br/><a href=\"greet/Josh\">Greet Josh</a>";
};

controllers.greeter.greet = function(request, response) {
    return "Hello, " + request.params.name + " Bitches!";
}

controllers.greeter.define = function(request, response) {
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

