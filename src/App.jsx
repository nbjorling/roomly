import React, { useState, useEffect } from 'react';
import LeftBar from './components/LeftBar.jsx';
import Overlay from './components/Overlay.jsx';
import RightBar from './components/RightBar.jsx';
import Canvas from './components/Canvas.jsx';
import './App.scss';
import './styling/bars.scss';
import './styling/canvas.scss';

function App({ store }) {
  const [storeState, setStoreState] = useState(store.getState());

  useEffect(() => {
    const fn = () => setStoreState(store.getState());
    store.onUpdate(fn);
    return () => store.offUpdate(fn);
  });

  return (
    <div className="App">
      {storeState.showInputBox ? <Overlay store={store} /> : null}
      {/* <LeftBar></LeftBar>
      <RightBar></RightBar> */}
      <Canvas store={store} storeState={storeState} ></Canvas>
    </div>
  );
}

export default App;
