const Map = require('./map.es6');
const DataManager = require('./data.es6');

class Controller{
  constructor(){
    this.map = new Map();
    this.data = new DataManager();
  }

  init(){
    this.map.mapAanmaken();
  }
}

window.onload = () => {
  const c = new Controller();
  c.init()
};
