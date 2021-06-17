import React, { useState, useEffect } from 'react';

const ProjectItem = ({ id, title, lastEdited, loadProject, deleteProject }) => {
  return (
    <li className="project-item">
      <div className="title-container" onClick={() => loadProject({ id })}>
        {title}
        <div className="last-edited">Last Edited: {lastEdited}</div>
      </div>
      <button className="download"><i className="fas fa-download"></i></button>
      <button className="trash" onClick={() => deleteProject({ id })}><i className="fas fa-trash"></i></button>
    </li>
  );
}

const Menu = ({ store, setMenuActive }) => {
  let [title, setTitle] = useState('');
  let [toggleCreate, setToggleCreate] = useState(false);
  let [projects, setProjects] = useState(store._state.projects || []);

  useEffect(() => {
    const fn = () => setProjects(store._state.projects);
    store.onUpdate(fn);
    return () => store.offUpdate(fn);
  }, [store]);

  function createProject() {
    store.createProject({ title });
    setToggleCreate(false);
    setTitle('');
  }

  function deleteProject({ id }) {
    store.deleteProject({ id });
  }

  function loadProject({ id }) {
    store.loadProject({ id });
    setMenuActive(false);
  }

  return (
    <div className="full-width-container">
      <div className="menu-container">
        <h1>ROOMLY</h1>
        {projects.length < 1
          ? <div className="instructions">
            You have no projects yet!
            <br></br> Click the "New Project" Button to start a project.
            </div>
          : null
        }
        <div className="project-list">
          {projects.map(project => {
            return (
              <ProjectItem
                key={project.id}
                id={project.id}
                title={project.title}
                lastEdited={project.lastEdited}
                loadProject={loadProject}
                deleteProject={deleteProject}
              />
            )
          })}
        </div>

        { toggleCreate && <input onChange={(e) => setTitle(e.target.value)} placeholder="Project Title"/> }
        { toggleCreate
          ? <button className="new-project" onClick={() => createProject()}>Create</button>
          : <button onClick={() => setToggleCreate(true)} className="new-project">New Project</button>
        }
      </div>
    </div>
  );
}

export default Menu;
