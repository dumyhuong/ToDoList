import { useEffect, useState } from "react";
import ToDo from "./components/ToDo";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllToDo,
  addToDo,
  updateToDo,
  deleteToDo,
  updateComplete,
} from "./utils/HandleApi";
import WebSocketClient from "./utils/WebSocketClient";

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

  // ⚡️ thay đúng URL backend + websocket của bạn
  const API_BASE = "https://6fba38de9272.ngrok-free.app";
  const WS_URL = "wss://6fba38de9272.ngrok-free.app"; // có thể là wss://.../ws tuỳ backend

  // Lấy danh sách ToDo khi load
  useEffect(() => {
    getAllToDo(setToDo, API_BASE);

    const ws = new WebSocketClient(`${WS_URL}/ws`);

    ws.onopen(() => {
      console.log(" WebSocket connected!");
      ws.send(JSON.stringify({ type: "hello", text: "Hi server" }));
    });

    ws.onmessage((msg) => {
      try {
        const data = JSON.parse(msg);
        console.log("WS message:", data);

        // nếu backend gửi update thì cập nhật luôn
        if (data.type === "updateList") {
          setToDo(data.todos);
        }
      } catch (err) {
        console.error(" WS parse error:", err);
      }
    });

    ws.onclose(() => console.log(" WebSocket closed"));
    ws.onerror((err) => console.error(" WebSocket error:", err));

    return () => ws.close();
  }, []);

  // Cập nhật progress
  useEffect(() => {
    const totalTask = toDo.length;
    const doneTask = toDo.filter((t) => t.complete).length;
    setTotal(totalTask);
    setCompleted(doneTask);
  }, [toDo]);

  // === CRUD ===
  const updateMode = (_id, currentText) => {
    setIsUpdating(true);
    setText(currentText);
    setOriginalText(currentText);
    setToDoId(_id);
  };

  const handleAddOrUpdate = () => {
    if (!text.trim()) return;

    if (isUpdating) {
      if (text.trim() === originalText.trim()) {
        resetInput();
        return;
      }
      updateToDo(toDoId, text, setToDo, setText, setIsUpdating, API_BASE);
      toast.info("Updated successfully!", { transition: Bounce });
    } else {
      addToDo(text, setText, setToDo, API_BASE);
      toast.success("Added successfully!", { transition: Bounce });
    }
  };

  const confirmAction = () => {
    if (modalAction === "delete") {
      deleteToDo(modalTargetId, setToDo, API_BASE);
      toast.success("Deleted successfully!", { transition: Bounce });
    } else if (modalAction === "update") {
      handleAddOrUpdate();
    }
    setShowModal(false);
  };

  const toggleComplete = (id, currentComplete) => {
    const newStatus = !currentComplete;
    setToDo((prev) =>
      prev.map((t) => (t._id === id ? { ...t, complete: newStatus } : t))
    );
    updateComplete(id, newStatus, setToDo, API_BASE);
  };

  const resetInput = () => {
    setIsUpdating(false);
    setText("");
    setToDoId("");
    setOriginalText("");
  };

  return (
    <div className="App">
      <div className="container">
        <h1>ToDo List</h1>

        <div className="star-container">
          <div className="header">
            <h3>Keep it up!</h3>
            <p id="numbers">
              {completed} / {total}
            </p>
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
            onChange={(e) => setText(e.target.value)}
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
          {toDo.map((item) => (
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
