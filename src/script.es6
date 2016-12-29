import $ from "jquery";

var objectArray = [];
var objArrayFiltered = [];
var map;
var service;
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
  for (var i = 0; i < 500; i++) {
    let newObject = {
      name: item[i].name,
      id: item[i].id,
      fall: item[i].fall,
      lat: item[i].reclat,
      long: item[i].reclong,
      year: (new Date(item[i].year)).toUTCString().substring(0, 16),
      yearGetal: Number((new Date(item[i].year)).toUTCString().substring(0, 16).slice(-4)),
      mass: item[i].mass,
      recclass: item[i].recclass,
      geo: item[i].geolocation,
    };
    objectArray.push(newObject);
  }
  marker(objectArray);
  console.log(objectArray);
}


// markers google maps
// =============================================================================

function marker(markersData) {
  markers = [];
  for(var i = 0; i < markersData.length; i++){
    let pos = {lat: Number(markersData[i].lat), lng: Number(markersData[i].long)};
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      clicable: true,
      id: markersData[i].id,
      name: markersData[i].name,
      fall: markersData[i].fall,
      recclass: markersData[i].recclass,
      mass: markersData[i].mass,
      year: markersData[i].year,
      lat: markersData[i].lat,
      long: markersData[i].long,
      // year: (new Date(markersData[i].year)).toUTCString().substring(0, 16),
    });
    markers.push(marker);
  }
  var markerCluster = new MarkerClusterer(map, markers, {imagePath: '../assets/images/m'});
  infoWindow();
  // console.log(markers);
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
      // info van de ma
      let pos = {lat: Number(this.lat), lng: Number(this.long)};
      findHotelsNearby(pos);

      //infowindow
      infowindow.setContent(
        "<h3>" + this.name + "</h3>" + "<ul class='info'>" +
          "<li><span>Fell:</span> " + this.fall + "</li>" +
          "<li><span>Year:</span> " + this.year + "</li>" +
          "<li><span>geo:</span> " + this.position + "</li>" +
          "<li><span>recclass:</span> " + this.recclass + "</li>" +
          "<li><span>mass:</span> " + this.mass + "</li>" +
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
  // console.log(input.value);
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


// form submit filter
// =============================================================================
$( "#filter_mass" ).submit(function( evt ) {
  evt.preventDefault();
  const getal = $("#filter_mass").serializeArray();
  if(getal[0].value < getal[1].value){
    console.log("is goed");
    filterMass(getal);
  }
  else {
    console.log("eerste getal moet lager dan tweede");
  }
});

$( "#filter_year" ).submit(function( evt ) {
  evt.preventDefault();
  const getal = $("#filter_year").serializeArray();
  if(getal[0].value < getal[1].value){
    console.log("is goed");
    filterYear(getal);
  }
  else {
    console.log("eerste getal moet lager dan tweede");
  }
});

$( "#filter_found" ).submit(function( evt ) {
  evt.preventDefault();
  const getal = $("#filter_found").serializeArray();
  filterFound(getal)
});


// filter reset
// =============================================================================

$("#reset").click(function (evt) {
  evt.preventDefault();
  updateMarkers(objectArray)
});

function updateMarkers(filterData) {
  initMap();
  marker(filterData);
}

// filter
// =============================================================================
function filterMass(filterNumber) {
  console.log(filterNumber);

  objArrayFiltered = $.grep(objectArray, function (element) {
    return (Number(element.mass) > Number(filterNumber[0].value) && Number(element.mass) < Number(filterNumber[1].value));
  });

  updateMarkers(objArrayFiltered);
}

function filterYear(filterNumber) {
  console.log(filterNumber);

  objArrayFiltered = $.grep(objectArray, function (element) {
    return ((element.yearGetal) > Number(filterNumber[0].value) && Number(element.yearGetal) < Number(filterNumber[1].value));
  });

  updateMarkers(objArrayFiltered);
}

function filterFound(filterfell) {
  console.log(filterfell);

  objArrayFiltered = $.grep(objectArray, function (element) {
    return (element.fall == filterfell[0].value);
  });

  updateMarkers(objArrayFiltered);
}


// places
// =============================================================================
function findHotelsNearby(location) {
  console.log(location);

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: location,
    radius: 10000,
    type: ['lodging']
  }, callback);
}


function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log(results);
  }
}

function createListHotels() {

}