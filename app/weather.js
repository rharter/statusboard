namespace('controllers.weather');

controllers.weather.current = function() {

	var current_json = bighub.net.urlconnection.request({
		//url: "http://api.wunderground.com/api/5e90fa43e982789c/conditions/q/60532.json",
		url: 'http://whatismyip.org/',
		complete: function (data, status) {
			// TESTING
			var data = '{"response":{"version":"0.1","termsofService":"http://www.wunderground.com/weather/api/d/terms.html","features":{"conditions":1}},"current_observation":{"image":{"url":"http://icons-ak.wxug.com/graphics/wu2/logo_130x80.png","title":"Weather Underground","link":"http://www.wunderground.com"},"display_location":{"full":"Lisle, IL","city":"Lisle","state":"IL","state_name":"Illinois","country":"US","country_iso3166":"US","zip":"60532","latitude":"41.78839874","longitude":"-88.07569885","elevation":"215.00000000"},"observation_location":{"full":"Main and Short Lisle, Lisle, Illinois","city":"Main and Short Lisle, Lisle","state":"Illinois","country":"US","country_iso3166":"US","latitude":"41.793331","longitude":"-88.074516","elevation":"712 ft"},"estimated":{},"station_id":"KILLISLE3","observation_time":"Last Updated on July 17, 2:47 PM CDT","observation_time_rfc822":"Tue, 17 Jul 2012 14:47:38 -0500","observation_epoch":"1342554458","local_time_rfc822":"Tue, 17 Jul 2012 14:52:31 -0500","local_epoch":"1342554751","local_tz_short":"CDT","local_tz_long":"America/Chicago","local_tz_offset":"-0500","weather":"Partly Cloudy","temperature_string":"96.6 F (35.9 C)","temp_f":96.6,"temp_c":35.9,"relative_humidity":"42%","wind_string":"Calm","wind_dir":"West","wind_degrees":270,"wind_mph":0.0,"wind_gust_mph":0,"wind_kph":0.0,"wind_gust_kph":0,"pressure_mb":"1010","pressure_in":"29.83","pressure_trend":"-","dewpoint_string":"68 F (20 C)","dewpoint_f":68,"dewpoint_c":20,"heat_index_string":"103 F (40 C)","heat_index_f":103,"heat_index_c":40,"windchill_string":"NA","windchill_f":"NA","windchill_c":"NA","feelslike_string":"103 F (35.9 C)","feelslike_f":"103","feelslike_c":"35.9","visibility_mi":"10.0","visibility_km":"16.1","solarradiation":"","UV":"10","precip_1hr_string":"0.00 in ( 0 mm)","precip_1hr_in":"0.00","precip_1hr_metric":" 0","precip_today_string":"0.00 in (0 mm)","precip_today_in":"0.00","precip_today_metric":"0","icon":"partlycloudy","icon_url":"http://icons-ak.wxug.com/i/c/k/partlycloudy.gif","forecast_url":"http://www.wunderground.com/US/IL/Lisle.html","history_url":"http://www.wunderground.com/history/airport/KILLISLE3/2012/7/17/DailyHistory.html","ob_url":"http://www.wunderground.com/cgi-bin/findweather/getForecast?query=41.793331,-88.074516"}	}';
	
			var weather = JSON.parse(data);
			
			var output = response.getOutputStream();
			output.println('<div id="current_weather">');
			output.println('<span class="temp">' + weather.current_observation.temp_f + '&#176; F</span>');
			output.println('<img src="/images/weather/icons/d/' + weather.current_observation.icon + '.png"/>');
			output.println('</div>');
			output.close();
		}
	});
}