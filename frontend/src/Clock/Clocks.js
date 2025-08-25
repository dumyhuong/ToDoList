import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
/* import "./style.css"; */

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMode = () => setDarkMode(!darkMode);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

  const dateString = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`clock-container ${darkMode ? "dark" : ""}`}>
      <div className="clock-header">
        <div className="clock-title">Digital Clock</div>
        <button className="mode-toggle" onClick={toggleMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <div className="clock-display">
        <div className="time">
          <span>{formattedHours}</span>:<span>{minutes}</span>:
          <span>{seconds}</span>
        </div>
        <div className="date">{dateString}</div>
        <div className="ampm">{ampm}</div>
      </div>
    </div>
  );
};

export default Clock;
