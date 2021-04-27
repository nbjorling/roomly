
const Menu = () => {
  return (
    <div className="full-width-container">
      <div className="menu-container">
        <h3 >Projects</h3>
        <ul>
          <li className="project-item">
            <div className="title">Project 1</div>
            <button className="download"><i class="fas fa-download"></i></button>
            <button className="trash"><i class="fas fa-trash"></i></button>
          </li>
          <li className="project-item">
            <div className="title">Project 2 The bedroom</div>
            <button className="download"><i class="fas fa-download"></i></button>
            <button className="trash"><i class="fas fa-trash"></i></button>
          </li>
        </ul>

        <button className="new-project">New Project</button>
      </div>
    </div>
  );
}

export default Menu;
