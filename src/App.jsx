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
  const myBlock = useRef(null);
  const statusBar = useRef(null);

  useEffect(() => {
    const fn = () => setStoreState(store.getState());
    store.onUpdate(fn);
    return () => store.offUpdate(fn);
  }, [store]);

  React.useLayoutEffect(() => {
    if (myBlock.current) {
      // create a simple instance on our object
      var mc = new Hammer(myBlock.current);

      // add a "PAN" recognizer to it (all directions)
      mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );

      // tie in the handler that will be called
      mc.on("pan", handleDrag);

      // poor choice here, but to keep it simple
      // setting up a few vars to keep track of things.
      // at issue is these values need to be encapsulated
      // in some scope other than global.
      var lastPosX = 0;
      var lastPosY = 0;
      var isDragging = false;
      function handleDrag(ev) {

        // for convience, let's get a reference to our object
        var elem = ev.target;

        // DRAG STARTED
        // here, let's snag the current position
        // and keep track of the fact that we're dragging
        if ( ! isDragging ) {
          isDragging = true;
          lastPosX = elem.offsetLeft;
          lastPosY = elem.offsetTop;
          setStatus("Moving Viewport");

        }

        // we simply need to determine where the x,y of this
        // object is relative to where it's "last" known position is
        // NOTE:
        //    deltaX and deltaY are cumulative
        // Thus we need to always calculate 'real x and y' relative
        // to the "lastPosX/Y"
        var posX = ev.deltaX + lastPosX;
        var posY = ev.deltaY + lastPosY;

        // move our element to that position
        elem.style.left = posX + "px";
        elem.style.top = posY + "px";

        // DRAG ENDED
        // this is where we simply forget we are dragging
        if (ev.isFinal) {
          isDragging = false;
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
      {/* <LeftBar></LeftBar> */}
      <div id="status" ref={statusBar}>Status</div>
      <RightBar></RightBar>
      <div id="viewport" ref={myBlock}>
        <Canvas store={store} storeState={storeState}></Canvas>
      </div>
    </div>
  );
}

export default App;
