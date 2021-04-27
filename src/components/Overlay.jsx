import React, { useState } from 'react';

const Overlay = ({ store }) => {
  const [values, setValues] = useState({title: '', color: "",width: 0, height: 0})

  const handleInputChange = e => {
    const {name, value} = e.target
    setValues({...values, [name]: value})
  }

  return (
    <div className="overlay-container">
      <div className="input-promt">
        <form>
          <input name="title" placeholder="title" value={values.title} onChange={(e) => handleInputChange(e)}></input>
          <input name="color" type="color" placeholder="color" value={values.color} onChange={(e) => handleInputChange(e)}></input>
          <input name="width" placeholder="width" value={values.width} onChange={(e) => handleInputChange(e)} ></input>
          <input name="height" placeholder="height" value={values.height} onChange={(e) => handleInputChange(e)} ></input>
          <button onClick={(e) => [e.preventDefault(), store.createFurniture({ title: values.title, color: values.color, width: values.width, height: values.height })]}>Create</button>
          <button onClick={(e) => store.closeFurnitureInputBox(e)}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default Overlay;
