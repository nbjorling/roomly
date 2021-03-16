import React from "react";
import Sketch from "react-p5";

let x = 50;
let y = 50;
const canvasWidth = 2000;
const canvasHeight = 2000;

const Canvas = () => {

  const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
	};

  const drawGrid = (p5, spacing) => {
    const nVerticalLines = canvasWidth / spacing;
    let verticalLines = [];
    for (let i = 0; i < nVerticalLines; i++) {
      verticalLines.push(
        p5.line(i * spacing, 0, i * spacing, canvasWidth)
      );
    }

    const nHorizontalLines = canvasWidth / spacing;
    let HorizontalLines = [];
    for (let i = 0; i < nHorizontalLines; i++) {
      HorizontalLines.push(
        p5.line(0, i * spacing, canvasHeight, i * spacing)
      );
    }
  }

  function doubleClick(event) {
    const x = event.mouseX;
    const y = event.mouseY;

    console.log("FOO DubbelKlick", x, y)
  }

	const draw = (p5) => {
		p5.background(255,255,255);
		p5.ellipse(x, y, 70, 70);
    drawGrid(p5, 50);
		// NOTE: Do not use setState in the draw function or in functions that are executed
		// in the draw function...
		// please use normal variables or class properties for these purposes
		x++;
	};

  return (
    <div className="canvas-container">
      <Sketch setup={setup} draw={draw} doubleClicked={(event) => doubleClick(event)}/>;
    </div>
  );
}

export default Canvas;
