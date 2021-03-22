import React, { useState, useEffect } from 'react';
import LeftBar from './components/LeftBar.jsx';
import Overlay from './components/Overlay.jsx';
import RightBar from './components/RightBar.jsx';
import Canvas from './components/Canvas.jsx';
import './styling/App.scss';
import './styling/bars.scss';
import './styling/canvas.scss';
import logo from './logo/logo.svg';

function App({ store }) {
  const [storeState, setStoreState] = useState(store.getState());

  useEffect(() => {
    const fn = () => setStoreState(store.getState());
    store.onUpdate(fn);
    return () => store.offUpdate(fn);
  }, [store]);

  return (
    <div className="App">
      {store._state.showInputBox ? <Overlay store={store} /> : null}

      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      {/* <LeftBar></LeftBar> */}
      <RightBar></RightBar>
      <Canvas store={store} storeState={storeState}></Canvas>
    </div>
  );
}

export default App;
