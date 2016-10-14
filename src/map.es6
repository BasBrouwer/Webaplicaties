class Map{
  constructor(){
    this.center = new google.maps.LatLng(52.3510634,4.6203004);
    this.mapOptions = {
      zoom: 15,
      center: this.center
    };
  }
  mapAanmaken(){
    this.map = new google.maps.Map(document.getElementById("map"), this.mapOptions);
  }
}

module.exports = Map;