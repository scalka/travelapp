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
					     [53.343864, -6.254808, "3", false, "Trinity College"],
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

					     [53.372417, -6.278448, "15", false, "National Botanic Gardens"],
					     [53.364326, -6.206327, "16", false, "Clontarf Castle"],
					     [53.387373, -6.256976, "17", false, "DCU"],
					     [53.388309, -6.066769, "18", false, "Howth"],
					     [53.356234, -6.306160, "19", false, "Dublin ZOO"],
					     [53.364326, -6.206327, "20", false, "IADT"],
					     [53.295164, -6.133847, "21", false, "Dún Laoghaire "],
					     [53.308122, -6.302724, "22", false, "Stop no _"],
					     [53.364320, -6.206927, "23", false, "Stop no _ "],
					     [53.364326, -6.206127, "24", false, "Stop no _ "],
					     [53.364326, -6.206327, "25", false, "Stop no _ "],
					     [53.342139, -6.286251, "26", false, "Stop no _ "],
					     [53.298926, -6.132908, "27", false, "Stop no _ "],
					     [53.339913, -6.271316, "28", false, "Stop no _ "],
					     [53.287659, -6.242560, "29", false, "Dundrum"]
			];
var infoWindowHtml = '<div id="iw">  <div id="iw_header">header</div>  <div id="iw_content">    <div id="iw_text">      <h2 id="iw_heading">heading</h2>      <p id="iw_paraghraph">iw_paraghraph</p>    </div>    <div id="iw_image"></div>  </div>  <button type="button" id="addToRouteBtn">Add</button></div>';


function initMap() {

//menu bottom -----------------------------------------------------------------------
	var button = document.getElementById('cn-button'),
	    wrapper = document.getElementById('cn-wrapper'),
	    overlay = document.getElementById('cn-overlay');

	//open and close menu when the button is clicked
	var open = false;
	button.addEventListener('click', handler, false);
	wrapper.addEventListener('click', cnhandle, false);

	function cnhandle(e){
		e.stopPropagation();
	}

	function handler(e){
		if (!e) var e = window.event;
	 	e.stopPropagation();//so that it doesn't trigger click event on document

	  	if(!open){
	    	openNav();
	  	}
	 	else{
	    	closeNav();
	  	}
	}
	function openNav(){
		open = true;
	    button.innerHTML = "-";
/*	    classie.add(overlay, 'on-overlay');*/
	    classie.add(wrapper, 'opened-nav');
	}
	function closeNav(){
		open = false;
		button.innerHTML = "+";
		/*classie.remove(overlay, 'on-overlay');*/
		classie.remove(wrapper, 'opened-nav');
	}
	document.addEventListener('click', closeNav);
//end menu bottom -----------------------------------------------------------------------------------

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

    var bottom_controls = document.getElementById('bottom_controls');
    var switch_view_control_list = document.getElementById('switch_view_control_list');

    var modes = document.getElementById('mode-selector');
// placing controls on the map
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(bottom_controls);
   	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(switch_view_control_list);
   /* map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);*/

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

    var route_summary_btn = document.getElementById("route_summary_btn");

    function route(origin_place_id, destination_place_id, travel_mode,
                   directionsService, directionsDisplay, waypoints) {      	

          if (!origin_place_id || !destination_place_id) {
            return;
          }
		directionsService.route({
            origin: {'placeId': origin_place_id},
            destination: {'placeId': destination_place_id},
            travelMode: travel_mode,
            waypoints: waypoints,
            optimizeWaypoints: true
          }, function(response, status) {
	          	//db with locasions
	          	if (status === 'OK') {
		              directionsDisplay.setDirections(response);
		              var route = response.routes[0];
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
					   route_summary_btn.addEventListener('click', function(){
		              	  console.log("route route_summary display");
			              var route_summary = document.getElementById('route_summary');
			              $('#route_summary').toggle();
			              $('#map').toggle();
			              route_summary.innerHTML = '';
							for (var i = 0; i < route.legs.length; i++) {
				              var routeSegment = i + 1;
				              route_summary .innerHTML += '<b>Route Segment: ' + routeSegment +
				                  '</b><br>';
				              route_summary.innerHTML += route.legs[i].start_address + ' to ';
				              route_summary.innerHTML += route.legs[i].end_address + '<br>';
				              route_summary.innerHTML += route.legs[i].distance.text + '<br><br>';
				            }
		              }); // end event listener
		        } else {
		              window.alert('Directions request failed due to ' + status);
		        }
		        var listview_btn = document.getElementById("listview_btn");
      				listview_btn.addEventListener('click', function(){
      					console.log("calling list");
      					displayList(locarray);
      				});
         		});
		} // end of route()
		//displaying markers near the polygon
		function displayMarkers(locarray){
			var marker = [];
			var content;
			var latlongset;
			infowindow = new google.maps.InfoWindow();
			// TODO click button set flag for added to route 
			for (var i=0; i < locarray.length; i++){
				latlongset = new google.maps.LatLng(locarray[i][0], locarray[i][1]);
				marker = new google.maps.Marker({
					    position: latlongset,
					    map: map,
					    title: locarray[i][4],
					    id: locarray[i][2]
			 	});
				
				google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
				    return function() {
				    	infowindow.setContent(infoWindowHtml);
				    	console.log(infowindow);
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
								//flag to check if waypoints is already added to the route
								var exists = false;
								//marker position 
								var markerLat = marker.getPosition().lat();
								var markerLng = marker.getPosition().lng();
								// for loop to check if marker's position is already added to the route
								for (var i = 0; i < waypoints.length; i++){
									//checking lat and lng of all the waypoints if they are the same as marker
									var waypointLat = waypoints[i].location.lat();
									var waypointLng = waypoints[i].location.lng();
									if (markerLat == waypointLat && markerLng == waypointLng){
										exists = true; // change flag 
										console.log("this stop is already included");
									} 
								}
								// if flag = true stop is not duplicated if its false stop is added to the route
								if (exists == false ){
									waypoints.push({
										location: marker.position,
										stopover: true
									});
									infowindow.close();
									console.log("waypoint added to the route");
								} // if exists end
							});	 // if add to route end
						} else {
							console.log("btn null");
						}
				    };
				})(marker,content,infowindow));  // close google.maps.event.addListener
			} // closing for loop
		} // closing displayMarkers function
	function displayList(locarray){
		$('#map').toggle();
		$('#listview').toggle();
		var listview = document.getElementById('listview');
		listview.innerHTML = '';
		for (var i=0; i < locarray.length; i++){
			console.log("num of markers: " + locarray.length);
			listview.innerHTML += ' <ul> <li> ' + locarray[i][4] +  ' </li> </ul> ';
		}
	}	
	

} // init() close

