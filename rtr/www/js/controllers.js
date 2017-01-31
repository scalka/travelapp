var map;
var origin_input;
var destination_input;
var bottom_controls;
var switch_view_control_list;
var switch_view_summary;
var modes;
var origin_autocomplete;
var destination_autocomplete;
var route;
var radioButton;
var listview_btn;
var route_summary_btn;
var route_summary;

var locarray;


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


angular.module('app.controllers', [])
  
.controller('startCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
	$scope.initMap = function () {
		origin_input = document.getElementById('origin-input');
    destination_input = document.getElementById('destination-input');

    origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
    destination_autocomplete =
        new google.maps.places.Autocomplete(destination_input);

    $scope.changemode = {
    	travel_mode: 'WALKING'
    };

    console.log(travel_mode);
    
     origin_autocomplete.addListener('place_changed', function() {
          var place = origin_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          origin_place_id = place.place_id;

    });

    destination_autocomplete.addListener('place_changed', function() {
          var place = destination_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          destination_place_id = place.place_id;

    }); 


	var mapOptions = {
      mapTypeControl: false,
      center: {lat: 53.3441, lng: -6.2675},
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
   	directionsDisplay.setMap($scope.map);
   	console.log($scope.map);

 	$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    $scope.routeFunction = function(){
    	console.log(
                directionsService, directionsDisplay);
    	$scope.route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay);
    }
    
	$scope.transportModes = function (id, mode) {
	      radioButton = document.getElementById(id);
	      radioButton.addEventListener('click', function() {
	        travel_mode = mode;
	      });
	}

	$scope.route = function(origin_place_id, destination_place_id, travel_mode,
	                   directionsService, directionsDisplay, waypoints) {   
	                   console.log("route call")   	
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
      		console.log(directionsDisplay);
          directionsDisplay.setDirections(response);

          var route = response.routes[0];
          /*//poliline from the JSON response array
          poliline = response.routes[0].overview_polyline; // gets the poliline from directions api 
          locarray = []; // to be filled if its near
          for(var i=0; i < loc.length; i++){
          		markerlatlng = new google.maps.LatLng(loc[i][0], loc[i][1]);
              	var isLocationNear = google.maps.geometry.poly.isLocationOnEdge(markerlatlng, new google.maps.Polyline({
				  path: google.maps.geometry.encoding.decodePath(poliline)
				}), 0.01); // 0.01 is about 1.1km ? 
			  if (isLocationNear){
			  	locarray.push(loc[i]);
			  } 
		  }
		  $scope.displayMarkers(locarray);*/
        } else {
              window.alert('Directions request failed due to ' + status);
        }
        
 		});
	} // end of route()

	//displaying markers near the polygon
	$scope.displayMarkers = function(locarray){
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
								console.log("rerouting with waypoints: " + waypoints);
						      	route(origin_place_id, destination_place_id, travel_mode, 
						            directionsService, directionsDisplay, waypoints );
							} // if exists end
						});	 // if add to route end
					} else {
						console.log("btn null");
					}
			    };
			})(marker,content,infowindow));  // close google.maps.event.addListener
		} // closing for loop
	} // closing displayMarkers function  

	}
}])
   
.controller('loginCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('savedRoutesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('addNewStopCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('pickYourStopsCtrl', ['$scope', '$stateParams', 
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {



}])
   
.controller('listCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 