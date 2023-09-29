import React from "react";

const Furniture = ({ onClick, furniture, selected }) => {
  return (
    <>
      {selected ? (
        <div className="furniture selected">
          <div>{furniture.title}</div>
          <div className="paragraph">
            Position X : {furniture.x} <br />
            Position Y : {furniture.y}
          </div>
        </div>
      ) : (
        <div className="furniture" onClick={onClick}>
          {furniture.title}
        </div>
      )}
    </>
  );
};

const RightBar = ({ store, storeState }) => {
  console.log("Koca: storeState ", storeState);
  let furnitures = storeState?.currentProject?.furnitures;

  return (
    <div className="bar-container bar-container--right">
      <div className="section">Top</div>
      <div className="section">
        Middle
        <div className="furniture-list">
          {furnitures?.map((furniture) => {
            if (furniture.title)
              return (
                <Furniture
                  onClick={() => store.selectItem(furniture.id)}
                  key={furniture.id}
                  furniture={furniture}
                  selected={furniture.id === storeState.selectedItem}
                />
              );
            return null;
          })}
        </div>
      </div>
      <div className="section">Bottom</div>
    </div>
  );
};

export default RightBar;
