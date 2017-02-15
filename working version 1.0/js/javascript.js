var map; 
var origin_input; // start
var origin_autocomplete;
var destination_input; // destination
var destination_autocomplete;
var switch_view_control_list; // div for listview button
var listview_btn;
var switch_view_summary; // div for summary btn
var route_summary_btn;
var route_summary;
var addToRoute_listview;

var route; // hold the route
var radioButton; // checked radioButton
var top_header; // heading on top of page
var locarray; 
var form;
var waypoints = []; // holds the waypoints
var origin_place_id = null;
var destination_place_id = null;
var travel_mode = 'WALKING';
var servicePlaces; // google places
var directionsService; // google directions service
var directionsDisplay; // google directions service
var poliline; //bounds
var infowindow;
var infoWindowHtml = '<div id="iw"> <div id="iw_content">  <div id="iw_text">      <h2 id="iw_heading">heading</h2>      <p id="iw_paraghraph"></p>    </div>    <div id="iw_image"> </div>  </div>  <button type="button" id="addToRouteBtn">Add</button></div>';
//second version
/*var infoWindowHtml = '<div id="iw">  <div id="iw_header"></div>  <div id="iw_content">    <div id="iw_text">      <h2 id="iw_heading">heading</h2>      <p id="iw_paraghraph">iw_paraghraph</p>    </div>    <div id="iw_image"></div>  </div>  <button type="button" id="addToRouteBtn">Add</button></div>';
*/
var listObject = '<button id"addBtn">';

var navopen = false; 
var placesResult = []; // all places near the route
var total_distance = 0; // total distance in km
var distance; // holds distance value 
var total_duration = 0; // total duration in h
var duration; // hold distance value
var listview;

var markersArray = [];

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    navopen = true;
}

function closeNav() {
    if (navopen = true){
    	document.getElementById("mySidenav").style.width = "0";
    	navopen = false;
    } 
}
function changeHeader(header){
	top_header = document.getElementById("top_header");
	top_header.innerHTML = header;
}

/*function openForm(){
	document.getElementById("form_div").classList.add("form_opened");
	document.getElementById("form_div").classList.remove("form_closed");
}*/
function closeForm(){
	document.getElementById("form_div").classList.add("form_closed");
/*	document.getElementById("form_div").classList.remove("form_opened");*/
}

function hideDiv(divId){
	$('#'+divId+'').hide();
}

function plan() {
	routeFunction(origin_place_id, destination_place_id, travel_mode,
		directionsService, directionsDisplay);

	setTimeout( hideDiv("form_div"), 4000); 

	changeHeader("Pick your stops");	
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: 53.3441, lng: -6.2675},
          zoom: 13
    });
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    servicePlaces = new google.maps.places.PlacesService(map);

	origin_input = document.getElementById('origin-input');
    destination_input = document.getElementById('destination-input');
    
    switch_view_control_list = document.getElementById('switch_view_control_list');
    switch_view_summary = document.getElementById('switch_view_summary');

    form = document.getElementById('plan_form');

	// placing controls on the map
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(switch_view_summary);
   	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(switch_view_control_list);


    origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
    origin_autocomplete.bindTo('bounds', map);
    destination_autocomplete =
        new google.maps.places.Autocomplete(destination_input);
    destination_autocomplete.bindTo('bounds', map);

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    
    transportModes('changemode-walking', 'WALKING');
    transportModes('changemode-driving', 'DRIVING');

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
    });

    route_summary_btn = document.getElementById("route_summary_btn");
	route_summary = document.getElementById('route_summary');
	h3_travel_mode = document.getElementById('h3_travel_mode');
	distance = document.getElementById('distance');
	duration = document.getElementById('duration');

	route_summary_btn.addEventListener('click', function(){     
		    route_summary.innerHTML = '';
				for (var i = 0; i < route.legs.length; i++) {
		          var routeSegment = i + 1;
		          route_summary .innerHTML += '<b>Route Segment: ' + routeSegment +
		              '</b><br>';
		          route_summary.innerHTML += route.legs[i].start_address + ' to ';
		          route_summary.innerHTML += route.legs[i].end_address + '<br>';
		          route_summary.innerHTML += route.legs[i].distance.text + '<br><br>';
		          total_distance = total_distance + route.legs[i].distance.value ; // distance in meters
		          total_duration = total_duration + route.legs[i].duration.value ; // indicates the duration in seconds.
		        }
		        var  total_distance_km = (total_distance/1000).toFixed(1) ;
		        var total_duration_h = (total_duration/3600).toFixed(2);
		        h3_travel_mode.innerHTML = travel_mode;
		        distance.innerHTML = total_distance_km + " km";
		        duration.innerHTML = total_duration_h + " h";

		        $('#modal_summary').modal();

    }); // end event listener

    listview_btn = document.getElementById("listview_btn");
	listview_btn.addEventListener('click', function(){
		//displayList(placesResult);
		$('#modal_list').modal();
	});

} // init() close



function transportModes(id, mode) {
      radioButton = document.getElementById(id);
      radioButton.addEventListener('click', function() {
        travel_mode = mode;
      });
}

function routeFunction(origin_place_id, destination_place_id, travel_mode,
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
          route = response.routes[0];
          //poliline from the JSON response array
          poliline = response.routes[0].overview_polyline; // gets the poliline from directions api 
          extendBounds(route.bounds);
		  //radius - Defines the distance (in meters) within which to return place results. The maximum allowed radius is 50 000 meters
		  var radius = document.getElementById('detour_range').value;
		  var request = {
		  	bounds: route.bounds,
		  	types: ['natural_feature','art_gallery', 'museum', 'amusement_park', 'park', 'stadium']
		  };
		  servicePlaces.nearbySearch(request, callback);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
        
 		});
} // end of route()

function extendBounds(bounds){
	/*console.log(bounds);
	console.log(bounds.getNorthEast());
	console.log(bounds.getSouthWest());*/
}

function callback(results, status, pagination) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
  	placesResult = results;
  
/* TODO  */
  if (pagination.hasNextPage) {
   	//each nextPage is a new request 	
      var moreButton = document.getElementById('more');
      moreButton.disabled = false;

      moreButton.addEventListener('click', function() {
        //moreButton.disabled = true;
        pagination.nextPage();
      });
/*      pagination.nextPage();*/
    }
    // get details about place  

      for (var i = 0; i < results.length; i++) {
	    	var place = results[i];
	        var detailsRequest = {
	        	placeId: place.place_id
	        }
/*	        //does not give too much detail
		    servicePlaces.getDetails(detailsRequest, call);*/
	     	createMarker(results[i]);
	     	}
    	}

}


function call() {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
	    console.log("details");
	  } else {
	  	console.log("Error");
	  }
	}
//called in callback()
function createMarker(place) {
		//getting info about a place
		//OPENING HOURS
		try{
			var opening_hours = "";
		  	var opening_hours = place.opening_hours.periods[1].open.time;
			// Loop through opening hours weekday text
	        for (var i = 0; i < place.opening_hours.weekday_text.length; i++) {
	            // Create DIV element and append to opening_hours_div

	            opening_hours += place.opening_hours.weekday_text[i];
	           // opening_hours_div.appendChild(content);
	        }
		}
		catch(e){
		  var opening_hours ='No work time';
		}
		//PHOTO
	   if ( place.photos != null ) {
			var photo_url = place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100});
		} else  {
			var photo_url = "http://placehold.it/350x150";
		}
		//TYPES
		var place_types="";
		for (var i=0; i < place.types.length; i++){
			place_types += (" " + place.types[i]);
		}

		//console.log("createMarker");
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        markersArray.push(marker);

        var ul = document.getElementById("list");
    	var li = document.createElement("li");
    	li.setAttribute("id", markersArray.length-1);
    	li.innerHTML = '<div class="card"> <img src="'+photo_url+'" class="img-thumbnail" alt="image" width="100" height="100">  <div class="card-block"> <h4 class="place_name">' + place.name + '</h4> <p class="place_description"> </p> <button id=addToRouteBtn">Add</button> </div> </div>';
        ul.appendChild(li);

        li.addEventListener('click', function(event){
        	var li_id = li.id;
        	console.log(li_id);
        	openMarker(li_id);
        });

        infowindow = new google.maps.InfoWindow();	
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(infoWindowHtml);
          infowindow.open(map, this);
		          	var iw = document.getElementById('iw');
		            var iw_header = document.getElementById('iw_header');
		            var iw_content = document.getElementById('iw_content');
		            var iw_text = document.getElementById('iw_text'); // in content div with h2 and p
		            var iw_heading = document.getElementById('iw_heading');
		            var iw_paraghraph = document.getElementById('iw_paraghraph');
		            var iw_image = document.getElementById('iw_image');

           iw_heading.innerHTML = place.name;
           
           iw_paraghraph.innerHTML += place.vicinity;

           iw_paraghraph.innerHTML += "<br>Types: " + place_types;
           iw_paraghraph.innerHTML += "<br> Rating " + place.rating;
           iw_paraghraph.innerHTML += "<br>Price level " + place.price_level;
           iw_paraghraph.innerHTML += "<br>Website " + place.website;
 
           iw_image.innerHTML = '<img src="'+photo_url+'" class="img-thumbnail" alt="image" width="100" height="100"> ';

            if (addToRouteBtn){
            	addToRouteBtn.addEventListener('click', function(){
            		addToRoute(place);
            	} );  // if add to route end
            } else {
               console.log("btn null");
            }
        });
}

function openMarker(id) {
	console.log(id);
	google.maps.event.trigger(markersArray[id], 'click');
}

function addToRoute(place) {
	console.log(place);
	var position = place.geometry.location; 
   var placeLat = place.geometry.location.lat();
   var placeLng = place.geometry.location.lng();
    //flag to check if waypoints is already added to the route
    var exists = false;
   console.log(waypoints);
    // for loop to check if marker's position is already added to the route
    for (var i = 0; i < waypoints.length; i++){
      //checking lat and lng of all the waypoints if they are the same as marker
      var waypointLat = waypoints[i].location.lat();
      var waypointLng = waypoints[i].location.lng();
      if (placeLat == waypointLat && placeLng == waypointLng){
        exists = true; // change flag 
        console.log("this stop is already included");
      } 
    }
    // if flag = true stop is not duplicated if its false stop is added to the route
    if (exists == false ){
      waypoints.push({
        location: position,
        stopover: true
      });
      infowindow.close();
      console.log("rerouting with waypoints: " + waypoints);
          routeFunction(origin_place_id, destination_place_id, travel_mode, 
              directionsService, directionsDisplay, waypoints );
        } // if exists end
};  // if add to route end

function addToRouteFromList(placeObject){
	console.log(placeObject.position);
	addToRoute();
}
