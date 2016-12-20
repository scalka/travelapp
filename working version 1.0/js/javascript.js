var waypoints = [];
var origin_place_id = null;
var destination_place_id = null;
var travel_mode = 'WALKING';
var directionsService;
var directionsDisplay;
var poliline;
var infowindow;
var loc = [
					     [53.345295, -6.263868, "1", false, "Temple Bar"],
					     [53.355863, -6.329631, "2", false, "Pheonix Park"],
					     [53.343864, -6.254808, "thr", false, "Trinity College"],
					     [53.342918, -6.267225, "4", false, "Dublin Castle"],
					     [53.338490, -6.259569, "5", false, "St. Stephen's Green"],
					     [53.343762, -6.260564, "6", false, "Molly Malone Statue"],
					     [53.305325, -6.220729, "7", false, "UCD"],
					     [53.314016, -6.218270, "8", false, "Elm Park Golf & Sports Club"],
					     [53.325886, -6.230117, "9", false, "RDS"],
					     [53.335281, -6.225468, "11", false, "Aviva Stadium"],
                        [53.344287, -6.239945, "12", false, "Bord Gáis Energy Theatre"],
                        [53.349648, -6.207791, "13", false, "Dublin Port"],
					     [53.364326, -6.206327, "14", false, "Clontarf Castle"],

					     [53.372417, -6.278448, "14", false, "National Botanic Gardens"],
					     [53.364326, -6.206327, "14", false, "Clontarf Castle"],
					     [53.387373, -6.256976, "14", false, "DCU"],
					     [53.388309, -6.066769, "14", false, "Howth"],
					     [53.356234, -6.306160, "14", false, "Dublin ZOO"],
					     [53.364326, -6.206327, "14", false, "IADT"],
					     [53.295164, -6.133847, "14", false, "Dún Laoghaire "],
					     [53.308122, -6.302724, "14", false, "Stop no _"],
					     [53.364320, -6.206927, "14", false, "Stop no _ "],
					     [53.364326, -6.206127, "14", false, "Stop no _ "],
					     [53.364326, -6.206327, "14", false, "Stop no _ "],
					     [53.342139, -6.286251, "14", false, "Stop no _ "],
					     [53.298926, -6.132908, "14", false, "Stop no _ "],
					     [53.339913, -6.271316, "14", false, "Stop no _ "],
					     [53.287659, -6.242560, "15", false, "Dundrum"]
			];
var infoWindowHtml = '<div id="iw">  <div id="iw_header">header</div>  <div id="iw_content">    <div id="iw_text">      <h2 id="iw_heading">heading</h2>      <p id="iw_paraghraph">iw_paraghraph</p>    </div>    <div id="iw_image"></div>  </div>  <button type="button" id="addToRouteBtn">Click</button></div>';


function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: 53.3441, lng: -6.2675},
          zoom: 13
    });
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);

    var origin_input = document.getElementById('origin-input');
    var destination_input = document.getElementById('destination-input');
    var modes = document.getElementById('mode-selector');

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

    var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
    origin_autocomplete.bindTo('bounds', map);
    var destination_autocomplete =
        new google.maps.places.Autocomplete(destination_input);
    destination_autocomplete.bindTo('bounds', map);

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, mode) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            travel_mode = mode;
          });
    }
    setupClickListener('changemode-walking', 'WALKING');
    setupClickListener('changemode-transit', 'TRANSIT');
    setupClickListener('changemode-driving', 'DRIVING');

    function expandViewportToFitPlace(map, place) {
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
    }

    origin_autocomplete.addListener('place_changed', function() {
          var place = origin_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          origin_place_id = place.place_id;
          route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay);
    });

    destination_autocomplete.addListener('place_changed', function() {
          var place = destination_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          destination_place_id = place.place_id;
          route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay);
    });

    // reroute btn listener and info window
	var reroute_btn = document.getElementById("reroute_btn");
      reroute_btn.addEventListener('click', function(){
      	console.log("rerouting with waypoints: " + waypoints);
      	 route(origin_place_id, destination_place_id, travel_mode, 
            directionsService, directionsDisplay, waypoints );
      });

    function route(origin_place_id, destination_place_id, travel_mode,
                   directionsService, directionsDisplay, waypoints) {      	

          if (!origin_place_id || !destination_place_id) {
            return;
          }
          directionsService.route({
	            origin: {'placeId': origin_place_id},
	            destination: {'placeId': destination_place_id},
	            travelMode: travel_mode,
	            waypoints: waypoints
          }, function(response, status) {
	          	//db with locasions
	          	if (status === 'OK') {
		              directionsDisplay.setDirections(response);
		              //poliline from the JSON response array
		              poliline = response.routes[0].overview_polyline; // gets the poliline from directions api 
		              var locarray = []; // to be filled if its near
		              for(var i=0; i < loc.length; i++){
		              		markerlatlng = new google.maps.LatLng(loc[i][0], loc[i][1]);
			              	var isLocationNear = google.maps.geometry.poly.isLocationOnEdge(markerlatlng, new google.maps.Polyline({
							  path: google.maps.geometry.encoding.decodePath(poliline)
							}), 0.01); // 0.01 is about 1.1km ? 
						  if (isLocationNear){
						  	locarray.push(loc[i]);
						  } 
					  }
					  displayMarkers(locarray);
		        } else {
		              window.alert('Directions request failed due to ' + status);
		        }
         	});        
		} // end of route()
		//displaying markers near the polygon
		function displayMarkers(locarray){
			var marker = [];
			var 
			var latlongset;
			infowindow = new google.maps.InfoWindow();
			// TODO click button set flag for added to route 
			for (var i=0; i < locarray.length; i++){
				latlongset = new google.maps.LatLng(locarray[i][0], locarray[i][1]);
				marker = new google.maps.Marker({
					    position: latlongset,
					    map: map,
					    title: locarray[i][4]
			 	});
				
				google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
				    return function() {
				    	infowindow.setContent(infoWindowHtml);
				        //infowindow.setContent(content + '<button type="button" id="addToRouteBtn">Click</button>');
				        infowindow.open(map,marker);
				        var iw = document.getElementById('iw');
						var iw_header = document.getElementById('iw_header');
						var iw_content = document.getElementById('iw_content');
						var iw_text = document.getElementById('iw_text'); // in content div with h2 and p
						var iw_heading = document.getElementById('iw_heading');
						var iw_paraghraph = document.getElementById('iw_paraghraph');
						var iw_image = document.getElementById('iw_image');

				    	iw_header.innerHTML = marker.title;
				    	iw_paraghraph.innerHTML = marker.position;

				        var addToRouteBtn = document.getElementById("addToRouteBtn");	    
				        if (addToRouteBtn){
							addToRouteBtn.addEventListener('click', function(){
								waypoints.push({
									location: marker.position,
									stopover: true
								})
								console.log("add to route: " + waypoints);
							});	
						} else {
							console.log("btn null");
						}

				    };
				})(marker,content,infowindow)); 
			} // closing for loop
		} // closing displayMarkers function

} // init() close