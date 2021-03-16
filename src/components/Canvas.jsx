import React from "react";
import Sketch from "react-p5";

const canvasWidth = 2000;
const canvasHeight = 2000;

const Canvas = ({ store, storeState }) => {

  const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of the component)
		p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
	};

  const drawGrid = (p5, spacing) => {
    p5.stroke(220,220,180);

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

  function doubleClick(p5) {
    const mx = p5.mouseX;
    const my = p5.mouseY;

    store.showFurnitureInputBox(mx, my);
  }

	const draw = (p5) => {
    p5.background(255,255,255);
    drawGrid(p5, 25);

   storeState.furnitures.forEach(furniture => {
      p5.fill(furniture.color);
      p5.rect(furniture.x, furniture.y, furniture.width, furniture.height);
    })
		// NOTE: Do not use setState in the draw function or in functions that are executed
		// in the draw function...
		// please use normal variables or class properties for these purposes
	};

  return (
    <div className="canvas-container">
      <Sketch setup={setup} draw={draw} doubleClicked={(p5) => doubleClick(p5)} />;
    </div>
  );
}

export default Canvas;
