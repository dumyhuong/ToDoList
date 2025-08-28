const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const { WebSocketServer, WebSocket } = require("ws");
const path = require("path");
require('dotenv').config();

const app = express();

// CORS
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const routes = require('./routes/ToDoRoute.js');
app.use('/api', routes);

// Serve frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected To MongoDB...'))
  .catch(err => console.log(err));

// Start Express
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket server (listen at /ws)
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.send(JSON.stringify({ type: "welcome", message: "Hello from WebSocket server" }));

  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "broadcast", message: message.toString() }));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
