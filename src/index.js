import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { v4 as uuidv4 } from 'uuid';

const DATAPOINTS = {
  FURNITURES: 'roomlyFurnitures',
  WALLS: 'roomlyWalls',
  ROOMS: 'roomlyRooms',
}

class Furniture {
  constructor({ id, title, color, x, y, width, height, rotation }) {
    this.id = id;
    this.title = title;
    this.color = color;
    this.rotation = rotation || 0;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Wall {
  constructor({ id, title, x, y, width, height, wallWidth }) {
    this.id = id;
    this.title = title;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.wallWidth = wallWidth || 100;
    this.windows = {};
    this.doors = {};
    this.opening = {};
  }
}
class Room {
  constructor({ id, title, x, y, width, height, wallWidth }) {
    this.id = id;
    this.title = title;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.wallWidth = wallWidth || 100;
    this.windows = {};
    this.doors = {};
    this.opening = {};
  }
}

class Window {
  constructor({ id, width, title }) {
    this.id = id;
    this.title = title || "Window";
    this.width = width;
  }
}

class Door {
  constructor({ id, width, title }) {
    this.id = id;
    this.title = title || "Door";
    this.width = width;
    this.openingSide = "left";
  }
}

class Store {

  constructor() {
    this._callbacks = new Set();
    this._state = {
      elements: [],
      furnitures:  this._getFromLocalStorate(DATAPOINTS.FURNITURES) || [],
      walls: this._getFromLocalStorate(DATAPOINTS.WALLS) || [],
      rooms: this._getFromLocalStorate(DATAPOINTS.ROOMS) || [],
      selectedItem: null,
      showInputBox: false,
      mouseCoordinates: { x: 0, y: 0 },
      canvasScale: 0.1,
      canvasCoordinates: { x: 0, y: 0}
    };
  }

  onUpdate(fn) {
    console.count("onUpdate")
    this._callbacks.add(fn);
  }

  offUpdate(fn) {
    this._callbacks.delete(fn);
  }

  getState() {
    return Object.assign({}, this._state);
  }

  selectItem(id) {
    this._state.selectedItem = id;
    this._callbacks.forEach(fn => fn());
  }

  _triggerCallbacks() {
    this._callbacks.forEach(fn => fn());
  }

  _saveToLocalStorage(datapoint, state) {
    localStorage.setItem(datapoint, JSON.stringify(state));
  }

  _getFromLocalStorate(datapoint) {
    return JSON.parse(localStorage.getItem(datapoint))
  }

  setFurniturePosition(id, x, y) {
    const moveX = Math.round(x);
    const moveY = Math.round(y);
    const newItems = [...this._state.furnitures];
    const index = newItems.findIndex(e => e.id === id);
    newItems[index] = {...newItems[index], x: newItems[index].x + moveX, y: newItems[index].y + moveY};
    console.log("moved item: x: ", moveX, "y: ", moveY);


    this._state.furnitures = newItems;
    this._saveToLocalStorage(DATAPOINTS.FURNITURES,  this._state.furnitures);
    this._triggerCallbacks();
  }

  setCanvasCoordinates(posX, posY) {
    this._state.canvasCoordinates = { x: posX, y: posY };
    this._triggerCallbacks();
  }

  calculateCoordinates(x, y) {
    const calculatedX = x / this._state.canvasScale;
    const calculatedY = y / this._state.canvasScale;
    return { calculatedX: calculatedX, calculatedY: calculatedY }
  }

  createFurniture({ title, color, width, height }) {
    console.log("Create new furniture");
    let furnitures = this._state.furnitures;
    const newId = uuidv4();
    furnitures.push(
      new Furniture({ id: newId, title: title, x: this._state.mouseCoordinates.x, y: this._state.mouseCoordinates.y, color: color, width: width, height: height })
    );
    this._state.showInputBox = false;
    this._saveToLocalStorage(DATAPOINTS.FURNITURES, this._state.furnitures);
    this._triggerCallbacks();
  }

  createRoom({ title, color, width, height }) {
    console.log("Create new room");
    let rooms = this._state.rooms;
    const newId = uuidv4();
    rooms.push(
      new Room({ id: newId, title: title, x: this._state.mouseCoordinates.x, y: this._state.mouseCoordinates.y, color: color, width: width, height: height })
    );
    this._state.showInputBox = false;
    this._saveToLocalStorage(DATAPOINTS.ROOMS, this._state.rooms);
    this._triggerCallbacks();
  }

  showFurnitureInputBox(mx, my) {
    this._state.mouseCoordinates = { x: mx, y:my }
    this._state.showInputBox = true;
    this._triggerCallbacks();
  }

  closeFurnitureInputBox(e) {
    this._state.showInputBox = false;
    this._triggerCallbacks();
  }

}

const store = new Store();

window.createFurniture = ((e) => store.createFurniture(e));
window.createRoom = ((e) => store.createRoom(e));

ReactDOM.render(
  <React.StrictMode>
    <App store={store}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
