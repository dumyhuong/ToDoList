const express = require('express')  
const mongoose = require('mongoose')
const routes = require('./routes/ToDoRoute.js') 
const cors = require ("cors")
const {WebSocketServer} = require("ws")
const path = require("path");

require('dotenv').config()
const app = express()
/* app.use(cors()); */
app.use(cors({
  origin: "https://c3f82d6441e6.ngrok-free.app",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Todo API is running...");
});
app.use('/api', require('./routes/ToDoRoute.js'));
app.use(routes);
// Serve frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

mongoose
.connect(process.env.MONGODB_URL)
.then(()=>console.log('Connected To MongoDB...'))
.catch( (err)=> console.log(err))
const PORT = process.env.PORT || 5000;


/* app.listen(PORT, () => {
  console.log(`Listening on: ${PORT}`);
}); */

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  
  ws.send(JSON.stringify({ type: "welcome", message: "Hello from WebSocket server" }));

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ type: "broadcast", message: message.toString() }));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

