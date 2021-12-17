import React from "react";

const Furniture = ({ furniture, selected }) => {
  return (
    <>
      {selected ? (
        <div className="furniture">
          <div>{furniture.title}</div>
          <div>
            Position X : {furniture.x}
            Position Y : {furniture.y}
          </div>
        </div>
      ) : (
        <div className="furniture">{furniture.title}</div>
      )}
    </>
  );
};

const RightBar = ({ store, storeState }) => {
  let furnitures = store._state?.currentProject?.furnitures;
  console.log("Koca: furnitures ", storeState);

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
                  key={furniture.id}
                  furniture={furniture}
                  selected={true}
                />
              );
          })}
        </div>
      </div>
      <div className="section">Bottom</div>
    </div>
  );
};

export default RightBar;
