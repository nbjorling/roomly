import React, { useState, useEffect, useRef } from 'react';
import LeftBar from './components/LeftBar.jsx';
import Overlay from './components/Overlay.jsx';
import RightBar from './components/RightBar.jsx';
import Canvas from './components/Canvas.jsx';
import './styling/App.scss';
import './styling/bars.scss';
import './styling/canvas.scss';
import logo from './logo/logo.svg';
import Hammer from 'hammerjs';

function App({ store }) {
  const [storeState, setStoreState] = useState(store.getState());
  const viewport = useRef(null);
  const statusBar = useRef(null);

  useEffect(() => {
    const fn = () => setStoreState(store.getState());
    store.onUpdate(fn);
    return () => store.offUpdate(fn);
  }, [store]);

  React.useLayoutEffect(() => {
    if (viewport.current) {
      var mc = new Hammer(viewport.current);

      mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );

      mc.on("pan", handleDrag);

      var lastPosX = 0;
      var lastPosY = 0;
      var isDragging = false;
      function handleDrag(ev) {
        var elem = ev.target;

        if ( ! isDragging ) {
          isDragging = true;
          lastPosX = elem.offsetLeft;
          lastPosY = elem.offsetTop;
          setStatus("Moving Viewport");
        }

        var posX = ev.deltaX + lastPosX;
        var posY = ev.deltaY + lastPosY;

        elem.style.left = posX + "px";
        elem.style.top = posY + "px";

        if (ev.isFinal) {
          isDragging = false;
          store.setCanvasCoordinates(storeState.canvasCoordinates.x + posX, storeState.canvasCoordinates.y + posY);
          setStatus("End Moving Viewport");
        }
      }

      function setStatus(msg) {
        statusBar.current.textContent = msg;
      }
    }
  });

  return (
    <div className="App">
      {store._state.showInputBox ? <Overlay store={store} /> : null}

      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <LeftBar></LeftBar>
      <div id="status" ref={statusBar}>Status</div>
      <RightBar></RightBar>
      <div id="viewport" ref={viewport} style={{transform: `translate3d(${storeState.canvasCoordinates.x}px, ${storeState.canvasCoordinates.y}px, 0)`}}>
        <Canvas store={store} storeState={storeState} canvasX={storeState.canvasCoordinates.x} canvasY={storeState.canvasCoordinates.y}></Canvas>
      </div>
    </div>
  );
}

export default App;
