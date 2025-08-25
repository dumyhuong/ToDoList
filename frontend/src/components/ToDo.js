import React from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";

const ToDo = ({ text, complete, toggleComplete, updateMode, deleteToDo }) => {
  return (
    <div className={`todo ${complete ? "done" : ""}`}>
      {/* Nhiệm vụ */}
      <div className="text" onClick={toggleComplete}>
        <input
          type="checkbox"
          checked={complete} 
          onChange={toggleComplete}
        />
        <span className="todo-text">{text}</span>
        {complete && <span className="done-label">completed</span>}
      </div>

      {/* Nút edit/delete */}
      <div className="icons">
        <BiEdit className="icon" onClick={updateMode} />
        <AiFillDelete className="icon" onClick={deleteToDo} />
      </div>
      
    </div>
  );
};

export default ToDo;
