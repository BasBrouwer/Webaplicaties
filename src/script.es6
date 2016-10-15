var objectArray = [];
var map;
var starting = false;
var wrapper = document.getElementById("wrapper");
var infowindow = null;
var markers = [];


// maps maker
// =============================================================================
function initMap() {
  let center = new google.maps.LatLng(56.183330,10.233330);
  let mapOptions = {
    zoom: 5,
    center: center
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}


// data verwerking
// =============================================================================
function dataReq() {
  let url = "https://data.nasa.gov/resource/y77d-th95.json";
  let token = "?$$app_token=UXXSKk12eqwgjmNvwKQqcx7u6";
  let xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      parseData(xmlHttp.responseText);
  };
  xmlHttp.open( "GET", url + token, false ); // false for synchronous request
  xmlHttp.send();
}

function parseData(data){
  let item = JSON.parse(data);
  // for (var i = 0; i < item.length; i++) {
  for (var i = 0; i < 300; i++) {
    let newObject = {
      name: item[i].name,
      id: item[i].id,
      fall: item[i].fall,
      lat: item[i].reclat,
      long: item[i].reclong,
      year: item[i].year,
      geo: item[i].geolocation,
    };
    objectArray.push(newObject);
  }
  marker();
}


// markers google maps
// =============================================================================

function marker() {
  for(var i = 0; i < objectArray.length; i++){
    let pos = {lat: Number(objectArray[i].lat), lng: Number(objectArray[i].long)};
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      clicable: true,
      id: objectArray[i].id,
      name: objectArray[i].name,
      fall: objectArray[i].fall,
      year: (new Date(objectArray[i].year)).toUTCString().substring(0, 16),
    });
    markers.push(marker);
  }
  var markerCluster = new MarkerClusterer(map, markers, {imagePath: './images/m'});
  infoWindow();
}


// info window
// =============================================================================

function infoWindow() {
  infowindow = new google.maps.InfoWindow({
    content: "Holder....",
  });

  for (var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    google.maps.event.addListener(marker, 'click', function () {
// where I have added .html to the marker object.
      infowindow.setContent(
        "<h3>" + this.name + "</h3>" + "<ul class='info'>" +
          "<li><span>Fell:</span> " + this.fall + "</li>" +
          "<li><span>Year:</span> " + this.year + "</li>" +
          "<li><span>geo:</span> " + this.position + "</li>" +
        "</ul>"
      );
      infowindow.open(map, this);
    });
  }
}
// GOOGLE MAPS SEARCH BOX
// =============================================================================
function searchBox() {
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  if (starting){
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  }
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    if(starting === false) {
      startApp();
    }
  });
}


// homepage - sluiten
// =============================================================================

function startApp() {
  wrapper.innerHTML = "";
  wrapper.style.display = 'none';
  starting = true;
  createSearchbar();
}

function createSearchbar() {
  var input = document.createElement("input");
  input.type = "text";
  input.className = "controls"; // set the CSS class
  input.id = "pac-input"; // set the CSS class
  input.style.marginTop = "9px";
  wrapper.appendChild(input);
  searchBox();
}


// start
// =============================================================================
window.onload = function () {
  initMap();
  dataReq();
  searchBox()
};
