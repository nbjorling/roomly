import React from "react";

import {DndContext} from '@dnd-kit/core';
import {useDroppable} from '@dnd-kit/core';
import {useDraggable} from '@dnd-kit/core';

function Draggable({ ...props }) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });

  const { calculatedX, calculatedY } = transform ? props.store.calculateCoordinates(transform.x, transform.y) : { calculatedX: 0, calculatedY : 0 }

  const style = transform ? {
    transform: `translate3d(${props.x + calculatedX}px, ${props.y + calculatedY}px, 0)`, backgroundColor: props.color, width: props.width + "px", height: props.height + "px", outline: props.isSelected ? "3px solid orange" : "none"
  } : {
    transform: `translate3d(${props.x}px, ${props.y}px, 0)`, backgroundColor: props.color, width: props.width + "px", height: props.height + "px", outline: props.isSelected ? "3px solid orange" : "none"
  };

  return (
    <div onClick={props.onClick} ref={setNodeRef} className={props.className} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}

function Droppable({ ...props }) {
  const {setNodeRef} = useDroppable({
    id: 'droppable',
  });

  return (
    <div ref={setNodeRef} className="dnd-container" style={{transform: 'scale(' + props.storeState.canvasScale + ')'}}>
      {props.children}
    </div>
  );
}

const Items = ({ items, className, store, storeState }) => {
  return items.map(item => {
    const isSelected = storeState.selectedItem === item.id;
    return (
      <Draggable onClick={() => store.selectItem(item.id)} key={item.id} id={item.id} className={className} x={item.x} y={item.y} color={item.color} width={item.width} height={item.height} isSelected={isSelected} store={store}>
          <div className="title">{item.title}</div>
          <div className="width">{item.width}cm</div>
          <div className="height">{item.height}cm</div>
      </Draggable>
      )
  });
}

const Canvas = ({ store, storeState }) => {

  function handleDragEnd(event) {
    const x = event.delta.x;
    const y = event.delta.y;
    const id = event.active.id;

    const { calculatedX, calculatedY } = store.calculateCoordinates(x, y)

    if (storeState.furnitures.find(item => item.id === id)) {
      store.setFurniturePosition(id, calculatedX, calculatedY)
    } else {
      store.setRoomPosition(id, calculatedX, calculatedY)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Droppable storeState={storeState}>
        <Items items={storeState.rooms} className={"room"} store={store} storeState={storeState}/>
        <Items items={storeState.furnitures} className={"furniture"} store={store} storeState={storeState}/>
      </Droppable>
    </DndContext>
  );
}

export default Canvas;
