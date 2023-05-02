import ReactDOM from "react-dom";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";
import { Store } from "./store";

import "./styling/normalize.scss";
import "./index.css";

const store = new Store();

declare global {
  interface Window {
    createProject: any;
    createFurniture: any;
    createRoom: any;
  }
}

window.createProject = (e: any) => store.createRoom(e);
window.createFurniture = (e: any) => store.createFurniture(e);
window.createRoom = (e: any) => store.createRoom(e);

ReactDOM.render(<App store={store} />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
