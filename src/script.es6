var objectArray = [];
var map;

function initMap() {
  let center = new google.maps.LatLng(56.183330,10.233330);
  let mapOptions = {
    zoom: 5,
    center: center
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

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
  for (var i = 0; i < item.length; i++) {
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

function marker() {
  for(var i = 0; i < objectArray.length; i++){
    let pos = {lat: Number(objectArray[i].lat), lng: Number(objectArray[i].long)};
    let marker = new google.maps.Marker({
      position: pos,
      map: map
    });
  }
}

window.onload = () => {
  initMap();
  dataReq();
};
