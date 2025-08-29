import React from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";

const ToDo = ({id, text, complete, toggleComplete, updateMode, deleteToDo }) => {
  return (
    <div className={`todo ${complete ? "done" : ""}`}>
      {/* Nhiệm vụ */}
      <div className="text" onClick={toggleComplete}>
        <input
          type="checkbox"
          checked={complete} 
          // onChange={toggleComplete}
        />
        <span className="todo-text">{text}</span>
        {complete && <span className="done-label"></span>}
      </div>

      {/* Nút edit/delete */}
      <div className="icons">
        <BiEdit 
          className={`icon ${complete ? "disabled" : ""}`}
          onClick={!complete ? () => updateMode(id, text, complete) : undefined}
          style={{ cursor: complete ? "not-allowed" : "pointer", opacity: complete ? 0.5 : 1 }}
        />
        <AiFillDelete className="icon" onClick={deleteToDo} />
      </div>
      
    </div>
  );
};

export default ToDo;
