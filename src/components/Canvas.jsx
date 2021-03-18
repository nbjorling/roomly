import React, { useState } from "react";
import Sketch from "react-p5";

import {DndContext} from '@dnd-kit/core';
import {useDroppable} from '@dnd-kit/core';
import {useDraggable} from '@dnd-kit/core';


const canvasWidth = 2000;
const canvasHeight = 2000;

const Canvas = ({ store, storeState }) => {
  const [isDropped, setIsDropped] = useState(false);

  const draggables = storeState.furnitures.map(furniture => {
    const isSelected = storeState.selectedItem === furniture.id;
    return (
      <Draggable key={furniture.id} id={furniture.id} x={furniture.x} y={furniture.y} color={furniture.color} width={furniture.width} height={furniture.height} isSelected={isSelected}>
        <div className="furniture-element">
          <p>
            {furniture.title}
          </p>
        </div>
      </Draggable>
      )
  });

  function Droppable(props) {
    const {isOver, setNodeRef} = useDroppable({
      id: 'droppable',
    });
    const style = {
      color: isOver ? 'green' : undefined,
    };


    return (
      <div ref={setNodeRef} style={style} className="dnd-container">
        {props.children}
      </div>
    );
  }


  function Draggable(props) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
      id: props.id,
    });

    const style = transform ? {
      transform: `translate3d(${props.x + transform.x}px, ${props.y + transform.y}px, 0)`, backgroundColor: props.color, width: props.width + "px", height: props.height + "px", outline: props.isSelected ? "5px solid orange" : "none"
    } : {
      transform: `translate3d(${props.x}px, ${props.y}px, 0)`, backgroundColor: props.color, width: props.width + "px", height: props.height + "px", outline: props.isSelected ? "5px solid orange" : "none"
    };

    return (
      <div ref={setNodeRef} className="furniture-test" style={style} {...listeners} {...attributes}>
        {props.children}
      </div>
    );
  }

  function handleDragEnd(event) {
    if (event.over && event.over.id === 'droppable') {
      const x = event.delta.x;
      const y = event.delta.y;
      const id = event.active.id;


      console.log(x);
      console.log(y);
      console.log(id);
      console.log(event);
      setIsDropped(true);
      store.setFurniturePosition(id, x, y)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Droppable>
        {draggables}
      </Droppable>
    </DndContext>
  );
}

export default Canvas;
