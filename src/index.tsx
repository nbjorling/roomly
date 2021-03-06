import React from 'react';
import ReactDOM from 'react-dom';
import './styling/normalize.scss';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { v4 as uuidv4 } from 'uuid';
import { Set } from 'typescript';

const DATAPOINTS = {
  PROJECTS: 'projects',
  FURNITURES: 'roomlyFurnitures',
  WALLS: 'roomlyWalls',
  ROOMS: 'roomlyRooms',
}

class Project {
  id: string
  title: string
  lastEdited: string
  furnitures: Array<Furniture>

  constructor(id: string, title: string, lastEdited: string) {
    this.id = id;
    this.title = title;
    this.lastEdited = lastEdited;
  }
}

class Room {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  wallWidth: number
  windows: object
  doors: object
  opening: object

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

class Furniture {
  id: string
  title: string
  color: string
  x: number
  y: number
  width: number
  height: number
  rotation: number

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


type StoreStateObject = {
  elements: Array<string>
  projects: Array<Project>
  currentProject: Project
  rooms: Array<Room>
  selectedItem: string
  showInputBox: boolean
  mouseCoordinates: { x: number, y: number }
  canvasScale: number
  canvasCoordinates: { x: number, y: number}
}

class Store {
  _callbacks: Set<any>
  _state: StoreStateObject

  constructor() {
    this._callbacks = new Set();
    this._state = {
      elements: [],
      projects: this._getFromLocalStorate(DATAPOINTS.PROJECTS) || [],
      currentProject: null,
      rooms: this._getFromLocalStorate(DATAPOINTS.ROOMS) || [],
      selectedItem: null,
      showInputBox: false,
      mouseCoordinates: { x: 0, y: 0 },
      canvasScale: 1,
      canvasCoordinates: { x: 200, y: 100}
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

  selectItem(id:string) {
    this._state.selectedItem = id;
    this._callbacks.forEach(fn => fn());
  }

  _triggerCallbacks() {
    this._callbacks.forEach(fn => fn());
  }

  _saveToLocalStorage(datapoint:string, state) {
    localStorage.setItem(datapoint, JSON.stringify(state));
    this._triggerCallbacks();
  }

  _getFromLocalStorate(datapoint:string) {
    return JSON.parse(localStorage.getItem(datapoint))
  }

  loadProject({ id }) {
    this._state.currentProject = this._state.projects.find(project => project.id === id);
  }

  // saveFurnituresToProject(projectId) {
  //   this._state.currentProject.furnitures = this._state.furnitures;
  // }

  saveProject() {
    let projects = this._state.projects;
    let idx = projects.findIndex(project => project.id === this._state.currentProject.id);
    let updatedProject = this._state.currentProject;
    projects.splice(idx, 1, updatedProject);
    this._saveToLocalStorage(DATAPOINTS.PROJECTS, projects);
  }

  setFurniturePosition(id:string, x:number, y:number) {
    const moveX = Math.round(x);
    const moveY = Math.round(y);
    const newItems = [...this._state.currentProject.furnitures];
    const index = newItems.findIndex(e => e.id === id);
    newItems[index] = {...newItems[index], x: newItems[index].x + moveX, y: newItems[index].y + moveY};
    this._state.currentProject.furnitures = newItems;
    this.saveProject();
    this._triggerCallbacks();
  }

  setRoomPosition(id:string, x:number, y:number) {
    const moveX = Math.round(x);
    const moveY = Math.round(y);
    const newItems = [...this._state.rooms];
    const index = newItems.findIndex(e => e.id === id);
    newItems[index] = {...newItems[index], x: newItems[index].x + moveX, y: newItems[index].y + moveY};
    this._state.rooms = newItems;
    this._saveToLocalStorage(DATAPOINTS.ROOMS, this._state.rooms);
    this._triggerCallbacks();
  }

  setCanvasCoordinates(posX:number, posY:number) {
    this._state.canvasCoordinates = { x: posX, y: posY };
    this._triggerCallbacks();
  }

  calculateCoordinates(x:number, y:number) {
    const calculatedX = x / this._state.canvasScale;
    const calculatedY = y / this._state.canvasScale;
    return { calculatedX: calculatedX, calculatedY: calculatedY }
  }

  createProject({ title }) {

    const newId = uuidv4();
    this._state.projects.push(
      new Project(newId, title, Date())
    );
    this._saveToLocalStorage(DATAPOINTS.PROJECTS, this._state.projects);
  }

  deleteProject({ id }) {
    const idx = this._state.projects.findIndex(project => project.id === id);
    this._state.projects.splice(idx, 1);
    this._saveToLocalStorage(DATAPOINTS.PROJECTS, this._state.projects);
  }

  createFurniture({ title, color, width, height }) {
    console.log("Create new furniture");
    let furnitures = this._state.currentProject.furnitures || [];
    const newId = uuidv4();
    furnitures.push(
      new Furniture({ id: newId, title: title, x: this._state.mouseCoordinates.x, y: this._state.mouseCoordinates.y, color: color, width: width, height: height, rotation: 0 })
    );

    this._state.currentProject.furnitures = furnitures;
    this._state.showInputBox = false;
    this.saveProject();
    this._triggerCallbacks();
  }

  createRoom({ title, width, height }) {
    console.log("Create new room");
    let rooms = this._state.rooms;
    const newId = uuidv4();
    rooms.push(
      new Room({ id: newId, title: title, x: this._state.mouseCoordinates.x, y: this._state.mouseCoordinates.y, width: width, height: height, wallWidth: 20 })
    );
    this._state.showInputBox = false;
    this._saveToLocalStorage(DATAPOINTS.ROOMS, this._state.rooms);
    this._triggerCallbacks();
  }

  showFurnitureInputBox(mx:number, my:number) {
    this._state.mouseCoordinates = { x: mx, y:my }
    this._state.showInputBox = true;
    this._triggerCallbacks();
  }

  closeFurnitureInputBox() {
    this._state.showInputBox = false;
    this._triggerCallbacks();
  }

}

const store = new Store();

declare global {
  interface Window {
    createProject: any;
    createFurniture: any;
    createRoom: any;
  }
}

window.createProject = ((e) => store.createRoom(e));
window.createFurniture = ((e) => store.createFurniture(e));
window.createRoom = ((e) => store.createRoom(e));
// window.saveFurnituresToProject = ((e) => store.saveFurnituresToProject(e));
// window.saveProjectToProjects = ((e) => store.saveProjectToProjects(e));

ReactDOM.render(
  <App store={store}/>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
