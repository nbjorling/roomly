import { v4 as uuidv4 } from "uuid";
import { Set } from "typescript";

type DATAPOINTS =
  | "projects"
  | "roomlyFurnitures"
  | "roomlyWalls"
  | "roomlyRooms";

class Project {
  id: string;
  title: string;
  lastEdited: string;
  furnitures: Array<Furniture>;

  constructor(id: string, title: string, lastEdited: string) {
    this.id = id;
    this.title = title;
    this.lastEdited = lastEdited;
    this.furnitures = [];
  }
}

class Room {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  wallWidth: number;
  windows: object;
  doors: object;
  opening: object;

  constructor({
    id,
    title,
    x,
    y,
    width,
    height,
    wallWidth,
  }: {
    id: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    wallWidth: number;
  }) {
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
  id: string;
  title: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;

  constructor({
    id,
    title,
    color,
    x,
    y,
    width,
    height,
    rotation,
  }: {
    id: string;
    title: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }) {
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
  elements: Array<string>;
  projects: Array<Project>;
  currentProject: Project | null;
  rooms: Array<Room>;
  selectedItem: string | null;
  showInputBox: boolean;
  mouseCoordinates: { x: number; y: number };
  canvasScale: number;
  canvasCoordinates: { x: number; y: number };
};

export class Store {
  _callbacks: Set<any>;
  _state: StoreStateObject;

  constructor() {
    this._callbacks = new Set();
    this._state = {
      elements: [],
      projects: this._getFromLocalStorate("projects") || [],
      currentProject: null,
      rooms: this._getFromLocalStorate("roomlyRooms") || [],
      selectedItem: null,
      showInputBox: false,
      mouseCoordinates: { x: 0, y: 0 },
      canvasScale: 1,
      canvasCoordinates: { x: 200, y: 100 },
    };
  }

  onUpdate(fn: () => void) {
    console.count("onUpdate");
    this._callbacks.add(fn);
  }

  offUpdate(fn: () => void) {
    this._callbacks.delete(fn);
  }

  getState() {
    return Object.assign({}, this._state);
  }

  selectItem(id: string) {
    this._state.selectedItem = id;
    this._callbacks.forEach((fn) => fn());
  }

  _triggerCallbacks() {
    this._callbacks.forEach((fn) => fn());
  }

  _saveToLocalStorage(datapoint: DATAPOINTS, state: any) {
    localStorage.setItem(datapoint, JSON.stringify(state));
    this._triggerCallbacks();
  }

  _getFromLocalStorate(datapoint: DATAPOINTS) {
    return JSON.parse(localStorage.getItem(datapoint) || "");
  }

  loadProject(id: string) {
    console.log("Koca: id ", id);
    this._state.currentProject =
      this._state.projects.find((project) => project.id === id) ||
      ({} as Project);
  }

  // saveFurnituresToProject(projectId) {
  //   this._state.currentProject.furnitures = this._state.furnitures;
  // }

  saveProject() {
    if (!this._state.currentProject || !this._state.projects) return;
    let projects = this._state.projects;
    let idx = projects.findIndex(
      (project) => project.id === this._state.currentProject?.id
    );
    let updatedProject = this._state.currentProject;
    projects.splice(idx, 1, updatedProject);
    this._saveToLocalStorage("projects", projects);
  }

  setFurniturePosition(id: string, x: number, y: number) {
    if (!this._state.currentProject || !this._state.projects) return;
    const moveX = Math.round(x);
    const moveY = Math.round(y);
    const newItems = [...this._state.currentProject.furnitures];
    const index = newItems.findIndex((e) => e.id === id);
    newItems[index] = {
      ...newItems[index],
      x: newItems[index].x + moveX,
      y: newItems[index].y + moveY,
    };
    this._state.currentProject.furnitures = newItems;
    this.saveProject();
    this._triggerCallbacks();
  }

  setRoomPosition(id: string, x: number, y: number) {
    const moveX = Math.round(x);
    const moveY = Math.round(y);
    const newItems = [...this._state.rooms];
    const index = newItems.findIndex((e) => e.id === id);
    newItems[index] = {
      ...newItems[index],
      x: newItems[index].x + moveX,
      y: newItems[index].y + moveY,
    };
    this._state.rooms = newItems;
    this._saveToLocalStorage("roomlyRooms", this._state.rooms);
    this._triggerCallbacks();
  }

  setCanvasCoordinates(posX: number, posY: number) {
    this._state.canvasCoordinates = { x: posX, y: posY };
    this._triggerCallbacks();
  }

  calculateCoordinates(x: number, y: number) {
    const calculatedX = x / this._state.canvasScale;
    const calculatedY = y / this._state.canvasScale;
    return { calculatedX: calculatedX, calculatedY: calculatedY };
  }

  createProject({ title }: { title: string }) {
    const newId = uuidv4();
    this._state.projects.push(new Project(newId, title, Date()));
    this._saveToLocalStorage("projects", this._state.projects);
  }

  deleteProject(id: string) {
    const idx = this._state.projects.findIndex((project) => project.id === id);
    this._state.projects.splice(idx, 1);
    this._saveToLocalStorage("projects", this._state.projects);
  }

  createFurniture({
    title,
    color,
    width,
    height,
  }: {
    title: string;
    color: string;
    width: number;
    height: number;
  }) {
    if (!this._state.currentProject) return;
    let furnitures = this._state.currentProject.furnitures || [];
    const newId = uuidv4();
    furnitures.push(
      new Furniture({
        id: newId,
        title: title,
        x: this._state.mouseCoordinates.x,
        y: this._state.mouseCoordinates.y,
        color: color,
        width: width,
        height: height,
        rotation: 0,
      })
    );

    this._state.currentProject.furnitures = furnitures;
    this._state.showInputBox = false;
    this.saveProject();
    this._triggerCallbacks();
  }

  createRoom({
    title,
    width,
    height,
  }: {
    title: string;
    width: number;
    height: number;
  }) {
    let rooms = this._state.rooms;
    const newId = uuidv4();
    rooms.push(
      new Room({
        id: newId,
        title: title,
        x: this._state.mouseCoordinates.x,
        y: this._state.mouseCoordinates.y,
        width: width,
        height: height,
        wallWidth: 20,
      })
    );
    this._state.showInputBox = false;
    this._saveToLocalStorage("roomlyRooms", this._state.rooms);
    this._triggerCallbacks();
  }

  showFurnitureInputBox(mx: number, my: number) {
    this._state.mouseCoordinates = { x: mx, y: my };
    this._state.showInputBox = true;
    this._triggerCallbacks();
  }

  closeFurnitureInputBox() {
    this._state.showInputBox = false;
    this._triggerCallbacks();
  }
}

declare global {
  interface Window {
    createProject: any;
    createFurniture: any;
    createRoom: any;
  }
}
