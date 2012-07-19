namespace('controllers.twitter');

controllers.twitter.search = function(request, response) {

	bighub.net.urlconnection.request({
		url: 'http://search.twitter.com/search.json?q=server%20side%20javascript',
		complete: function (data, status) {
			var data = JSON.parse(data);
			
			response.setContentType('text/html');
			var output = response.getOutputStream();
			output.println('<ul>');
			
			for (var i = 0; i < data.results.length; i++) {
				var tweet = data.results[i];
				
				output.println('<li>');
			
				output.print('<span class="from_user">');
				output.print(tweet.from_user);
				output.print('</span> - ');
				
				output.print('<span class="text">');
				output.print(tweet.text);
				output.print('</span>');
				
				output.println('</li>');
			}
			
			output.println('</ul>');
			
			output.close();
		}
	});
}