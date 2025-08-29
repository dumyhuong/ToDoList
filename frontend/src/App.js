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

  const API_BASE = "https://2297566171ac.ngrok-free.app";
  const WS_URL = "wss://2297566171ac.ngrok-free.app";

  // Lấy danh sách ToDo khi load
  useEffect(()=>{
    console.log("Todo:",toDo.map(t=>t._id));
  },[toDo.length]);
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

  //CRUD 
  const updateMode = (_id, currentText, isComplete) => {
    if(isComplete) {
      toast.info("Task is complete");
      return ;
    } 
    setIsUpdating(true);
    setText(currentText);
    setOriginalText(currentText);
    setToDoId(_id);
  };

  const handleAddOrUpdate = () => {
    if (!text.trim()) return; // Nếu text rỗng (chỉ toàn khoảng trắng) thì không làm gì

    if (isUpdating) { // Nếu đang ở chế độ cập nhật nhưng text không thay đổi so với bản gốc
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
    // Hàm xác nhận hành động trong modal (xóa hoặc cập nhật)
  const confirmAction = () => { 
    if (modalAction === "delete") {
      deleteToDo(modalTargetId, setToDo, API_BASE);
      toast.success("Deleted successfully!", { transition: Bounce });
    } else if (modalAction === "update") {
      handleAddOrUpdate(); // Nếu xác nhận cập nhật thì gọi lại handleAddOrUpdate
    }
    setShowModal(false); // Đóng modal sau khi thực hiện xong
  };

  const toggleComplete = async (id, currentComplete) => {
    //console.log(1);
    const newStatus = !currentComplete;
    setToDo((prev) => // Cập nhật state ngay để UI phản ứng nhanh (optimistic update)
      prev.map((t) => (t._id === id ? { ...t, complete: newStatus } : t))
    );
    await updateComplete(id, newStatus, setToDo, API_BASE); // Gọi API để cập nhật trạng thái trong backend
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
           
        <div className="list-wapper">
          <div className="list">
          {toDo.map((item) => (
            <ToDo
              key={item._id}
              id={item._id}
              text={item.text}
              complete={Boolean(item.complete)}
              toggleComplete={() => toggleComplete(item._id, item.complete)}
              updateMode={() => updateMode(item._id, item.text,item.complete)}
              deleteToDo={() => {
                setModalTargetId(item._id);
                setModalAction("delete");
                setShowModal(true);
              }}
            />
          ))}
        </div>
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
