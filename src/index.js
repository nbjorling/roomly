import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';

class Furniture {
  constructor(title, color, x, y, width, height) {
    this.title = title;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Store {

  constructor() {
    this._callbacks = new Set();
    this._state = {
      elements: [],
      furnitures: JSON.parse(localStorage.getItem('roomlyFurnitures')) || [],
      selected: null,
      showInputBox: false,
      mouseCoordinates: {x: 0, y: 0}
    };
  }
  onUpdate(fn) {
    this._callbacks.add(fn);
  }

  offUpdate(fn) {
    this._callbacks.delete(fn);
  }

  getState() {
    console.log("Got state");
    return Object.assign({}, this._state);
  }

  // selectElement(item) {
  //   this._state.selected = item;
  //   this._callbacks.forEach(fn => fn());
  // }

  // unSelectElement() {
  //   this._state.selected = null;
  //   this._callbacks.forEach(fn => fn());
  // }

  createFurniture({ title, color, width, height }) {
    let furnitures = this._state.furnitures;

    furnitures.push(
      new Furniture(title, color, this._state.mouseCoordinates.x, this._state.mouseCoordinates.y, width, height)
    );
    this._state.showInputBox = false;
    this._callbacks.forEach(fn => fn());
    localStorage.setItem('roomlyFurnitures', JSON.stringify(this._state.furnitures));
  }

  showFurnitureInputBox(mx, my) {
    this._state.mouseCoordinates = { x: mx, y:my }
    this._state.showInputBox = true;
    this._callbacks.forEach(fn => fn());
  }

  closeFurnitureInputBox(e) {
    this._state.showInputBox = false;
    this._callbacks.forEach(fn => fn());
  }

}

const store = new Store();


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
