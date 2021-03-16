import LeftBar from './components/LeftBar.jsx';
import BottomBar from './components/BottomBar.jsx';
import RightBar from './components/RightBar.jsx';
import Canvas from './components/Canvas.jsx';
import './App.css';
import './styling/bars.scss';
import './styling/canvas.scss';

function App() {
  return (
    <div className="App">
      <LeftBar></LeftBar>
      {/* <BottomBar></BottomBar> */}
      <RightBar></RightBar>
      <Canvas></Canvas>
    </div>
  );
}

export default App;
