var geocoder;
var map;
var markers = Array();
var infos = Array();



function initialize() {
    // prepare Geocoder
    geocoder = new google.maps.Geocoder();
    // set initial position (New York)
    var myLatlng = new google.maps.LatLng(40.7143528,-74.0059731);
    var myOptions = { 
        zoom: 14,
        center: myLatlng,
        styles: [{
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#d3d3d3"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "color": "#808080"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#b3b3b3"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "weight": 1.8
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d7d7d7"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ebebeb"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a7a7a7"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#efefef"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#696969"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#737373"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d6d6d6"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {},
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    }
]
        
};

    map = new google.maps.Map(document.getElementById('gmap_search'), myOptions);
}
// clear overlays function
function clearOverlays() {
    if (markers) {
        for (i in markers) {
            markers[i].setMap(null);
        }
        markers = [];
        infos = [];
    }
}
// clear infos function
function clearInfos() {
    if (infos) {
        for (i in infos) {
            if (infos[i].getMap()) {
                infos[i].close();
            }
        }
    }
}



// find custom places function
function findPlaces() {
    var address = document.getElementById("gmap_where").value;
    // script uses 'geocoder' in order to find location by address name
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) { // and, if everything is ok
            // will center map
            var addrLocation = results[0].geometry.location;
            map.setCenter(addrLocation);
            // store current coordinates into hidden variables
            document.getElementById('lat').value = results[0].geometry.location.lat();
            document.getElementById('lng').value = results[0].geometry.location.lng();


            // add new custom marker
            var addrMarker = new google.maps.Marker({
                position: addrLocation,
                map: map,
                title: results[0].formatted_address,
                icon: 'marker.png',


            }
            );


    var type = "restaurant";
    var radius = "500";
    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var cur_location = new google.maps.LatLng(lat, lng);
    var rating = ["3", "4", "5"]
    // prepare request to Places
    var request = {
        location: cur_location,
        radius: radius,
        types: [type],
        rating: rating,
    };
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
    service.getDetails(request, createMarkers);

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }

    });
    
};

//search on enter
function handle(e){
    if(e.keyCode === 13) {
        e.preventDefault();
        findPlaces();
        $(".overlay").hide(1000);
    }
};

//hide overlay after search
$(document).ready(function() {
    $("#button1").click(function(){
        $(".overlay").hide(1000);
    });
});

//show overlay when click search
$(document).ready(function() {
    $("#searchbtn").click(function(){
        $(".overlay").show(1000);
    });
});



// create markers (from 'findPlaces' function)
function createMarkers(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        // if we have found something - clear map (overlays)
        clearOverlays();
        // and create new markers by search result
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        alert('Sorry, nothing is found. Search again.');
    }
}
// creare single marker function

function createMarker(obj) {
    var image = 'https://cdn4.iconfinder.com/data/icons/48x48-free-object-icons/48/Green_pin.png';
    // prepare new Marker object
    var mark = new google.maps.Marker({
        position: obj.geometry.location,
        map: map,
        title: obj.name,
        icon: image
    });
    markers.push(mark);
    // prepare info window
    
    var infowindow = new google.maps.InfoWindow({
        content: 
        '<img src="' + obj.icon + '" /><font style="color:#000;">' + obj.name +
        '<br />Rating: ' + obj.rating + '<br />Address: ' + obj.vicinity + '<br />Price: ' + 
        obj.price_level + '</font>'
    });
    
    // add event handler to current marker
    google.maps.event.addListener(mark, 'click', function() {
        clearInfos();
        infowindow.open(map,mark);
    });
    infos.push(infowindow);
}



// initialization
google.maps.event.addDomListener(window, 'load', initialize);