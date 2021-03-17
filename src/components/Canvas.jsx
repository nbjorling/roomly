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
	};

  const furnitureElements = storeState.furnitures.map(furniture => {
    const isSelected = storeState.selectedItem === furniture.id;
    return (
      <div className="furniture-element" key={furniture.id} onClick={() => store.selectItem(furniture.id)}style={{ backgroundColor: furniture.color, width: furniture.width + "px", height: furniture.height + "px", left: furniture.x, top: furniture.y, outline: isSelected ? "5px solid orange" : "none" }}>
        <p>
          {furniture.title}
        </p>
      </div>
      )
  })

  return (
    <div className="canvas-container">
      {furnitureElements}
      <Sketch setup={setup} draw={draw} doubleClicked={(p5) => doubleClick(p5)} />;
    </div>
  );
}

export default Canvas;
