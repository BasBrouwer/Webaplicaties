class DataManager{
  constructor(){
    this.url = "https://data.nasa.gov/resource/y77d-th95.json";
    this.token = "?$$token=UXXSKk12eqwgjmNvwKQqcx7u6";
    this.xmlHttp = new XMLHttpRequest();
  }
  reqData(){
    this.xmlHttp.onreadystatechange = function() {
      if (this.xmlHttp.readyState == 4 && this.xmlHttp.status == 200)
        callback(this.xmlHttp.responseText);
    };
    this.xmlHttp.open( "GET", this.url + this.token, false ); // false for synchronous request
    this.xmlHttp.send();
  }
}

module.exports = DataManager;




// TODO API endpoint - https://data.nasa.gov/resource/y77d-th95.json
// TODO API token - UXXSKk12eqwgjmNvwKQqcx7u6
// TODO api secret token - PuHWOxeDTxelND4iZIhATISI8sAn79YN7pls