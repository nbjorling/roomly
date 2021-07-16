import React, { useState } from "react";

const buttonStyling = {
  position: 'absolute',
  background: 'orangered'
}

const containerStyling = {
  position: 'relative',
  zIndex: '9999',
  width: '75vw',
  height: 'auto',
  marginLeft: 'auto',
  marginRight: 'auto',
  top: '40px',
  padding: '20px',
  background: 'white',
  maxHeight: '80vh',
  overflowY: 'scroll'
}

const DataOverlay = ({ storeState }) => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  return (
    <>
      {overlayVisible
      ?
        <div className="data-overlay" style={{ display: 'flex' }}>
          <button style={buttonStyling} onClick={() => setOverlayVisible(false)}>Hide Data</button>
          <div style={containerStyling}>
            <h2>StoreState</h2>
            {storeState && JSON.stringify(storeState)}
          </div>
        </div>
      :
        <button styling={buttonStyling} onClick={() => setOverlayVisible(true)}>Show Data</button>
      }
    </>
  );
}

export default DataOverlay;
