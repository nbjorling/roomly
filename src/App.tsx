import React, { useState, useEffect, useRef } from "react";
import Overlay from "./components/Overlay.jsx";
import Canvas from "./components/Canvas";
import DataOverlay from "./components/DataOverlay";
import Menu from "./components/Menu";
import Hammer from "hammerjs";
import RightBar from "./components/RightBar.jsx";
import { Store } from "./store.js";
import "./styling/App.scss";
import "./styling/normalize.scss";
import "./styling/bars.scss";

function App({ store }: { store: Store }) {
  const [storeState, setStoreState] = useState(store.getState());
  const viewport = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  let [menuActive, setMenuActive] = useState(true);

  useEffect(() => {
    const fn = () => setStoreState(store.getState());
    store.onUpdate(fn);
    return () => store.offUpdate(fn);
  }, [store]);

  React.useLayoutEffect(() => {
    if (viewport.current) {
      var mc = new Hammer(viewport.current);

      mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));

      var lastPosX = 0;
      var lastPosY = 0;
      var isDragging = false;
      const handleDrag = (ev: any) => {
        var elem = ev.target;

        if (ev.srcEvent.target.id === "camera") {
          if (isDragging) {
            isDragging = true;
            lastPosX = elem.offsetLeft;
            lastPosY = elem.offsetTop;
            setStatus("Moving Viewport");
          }

          var posX = ev.deltaX + lastPosX;
          var posY = ev.deltaY + lastPosY;

          // elem.style.left = posX + "px";
          // elem.style.top = posY + "px";
          elem.style.transform = `translate(${
            storeState.canvasCoordinates.x + posX
          }px, ${storeState.canvasCoordinates.y + posY}px)`;
          if (ev.isFinal) {
            isDragging = false;
            store.setCanvasCoordinates(
              storeState.canvasCoordinates.x + posX,
              storeState.canvasCoordinates.y + posY
            );
            setStatus("End Moving Viewport");
          }
        }
      };

      const setStatus = (msg: string) => {
        if (statusBarRef?.current?.textContent) {
          statusBarRef.current.textContent = msg;
        }
      };

      mc.on("pan", handleDrag);
    }
  });

  return (
    <div className="App">
      {store._state.showInputBox ? <Overlay store={store} /> : null}
      <div id="status" ref={statusBarRef}>
        Status
      </div>
      <RightBar store={store} storeState={storeState}></RightBar>
      {menuActive ? <Menu store={store} setMenuActive={setMenuActive} /> : null}
      <div
        id="camera"
        ref={viewport}
        style={{
          transform: `translate3d(${storeState.canvasCoordinates.x}px, ${storeState.canvasCoordinates.y}px, 0)`,
        }}
      >
        <Canvas store={store} storeState={storeState}></Canvas>
      </div>
      <DataOverlay storeState={storeState} />
    </div>
  );
}

export default App;
