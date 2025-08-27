import { useEffect, useState } from 'react';
import ToDo from './components/ToDo';
import { toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAllToDo, addToDo, updateToDo, deleteToDo, updateComplete } from './utils/HandleApi';

function App() {
  const [toDo, setToDo] = useState([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [toDoId, setToDoId] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalTargetId, setModalTargetId] = useState("");
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);

  const API_BASE = "https://9fa596a6c99d.ngrok-free.app"; // Thay bằng URL ngrok hiện tại

  // Lấy danh sách ToDo và kết nối WebSocket
  useEffect(() => {
    getAllToDo(setToDo);

    const ws = new WebSocket(API_BASE.replace(/^http/, 'ws'));

    ws.onopen = () => {
      console.log("WS connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "broadcast") {
          setToDo(prev => [...prev, { _id: Date.now(), text: data.message }]);
        }
      } catch (err) {
        console.error("Non-JSON message:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("WS disconnected");
    };

    return () => ws.close();
  }, []);

  // Cập nhật tổng số task và số completed
  useEffect(() => {
    const totalTask = toDo.length;
    const doneTask = toDo.filter(t => t.complete).length;
    setTotal(totalTask);
    setCompleted(doneTask);
  }, [toDo]);

  const updateMode = (_id, currentText) => {
    setIsUpdating(true);
    setText(currentText);
    setOriginalText(currentText);
    setToDoId(_id);
  };

  const handleAddOrUpdate = () => {
    if (isUpdating) {
      if (text.trim() === originalText.trim()) {
        setIsUpdating(false);
        setText("");
        setToDoId("");
        return;
      }
      updateToDo(toDoId, text, setToDo, setText, setIsUpdating);
      toast.info("Updated successfully!", { transition: Bounce });
    } else {
      addToDo(text, setText, setToDo);
      toast.success("Added successfully!", { transition: Bounce });
    }
  };

  const confirmAction = () => {
    if (modalAction === "delete") {
      deleteToDo(modalTargetId, setToDo);
      toast.success("Deleted successfully!", { transition: Bounce });
    } else if (modalAction === "update") {
      handleAddOrUpdate();
      toast.info("Updated successfully!", { transition: Bounce });
    }
    setShowModal(false);
  };

  const toggleComplete = (id, currentComplete) => {
    const newStatus = !currentComplete;
    setToDo(prev =>
      prev.map(t => (t._id === id ? { ...t, complete: newStatus } : t))
    );
    updateComplete(id, newStatus, setToDo);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>ToDo List</h1>

        <div className="star-container">
          <div className="header">
            <h3>Keep it up!</h3>
            <p id="numbers">{completed} / {total}</p>
          </div>
          <div id="progressbar">
            <div
              id="progress"
              style={{
                width: total > 0 ? `${(completed / total) * 100}%` : "0%",
              }}
            ></div>
          </div>
        </div>

        <div className="top">
          <input
            type="text"
            placeholder="Add ToDo..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button
            className="add"
            onClick={() => {
              if (isUpdating) {
                setModalAction("update");
                setShowModal(true);
              } else {
                handleAddOrUpdate();
              }
            }}
            disabled={!text.trim()}
          >
            {isUpdating ? "Update" : "Add"}
          </button>
        </div>

        <div className="list">
          {toDo.map(item => (
            <ToDo
              key={item._id}
              text={item.text}
              complete={Boolean(item.complete)}
              toggleComplete={() => toggleComplete(item._id, item.complete)}
              updateMode={() => updateMode(item._id, item.text)}
              deleteToDo={() => {
                setModalTargetId(item._id);
                setModalAction("delete");
                setShowModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>
              {modalAction === "delete"
                ? "Are you sure want to delete?"
                : "Do you want to save changes to this task?"}
            </p>
            <button onClick={confirmAction}>Yes</button>
            <button onClick={() => setShowModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
