const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const { WebSocketServer } = require("ws");

const path = require("path");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API route
const routes = require('./routes/ToDoRoute.js');
app.use('/api', routes);

// Serve React build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected To MongoDB...'))
  .catch(err => console.log(err));

// Start Express server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket gắn trực tiếp vào server Express
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // Gửi welcome message
  ws.send(JSON.stringify({ type: "welcome", message: "Hello from WebSocket server" }));

  // Nhận tin nhắn từ client
  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    wss.clients.forEach(client => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ type: "broadcast", message: message.toString() }));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
