const { WebSocketServer } = require("ws");

// Sau khi tạo server Express
const server = app.listen(PORT, () => {
  console.log(`Listening on : ${PORT}`);
});

// Tạo WebSocket server gắn với server Express
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // Gửi tin nhắn chào khi client kết nối
  ws.send(JSON.stringify({ type: "welcome", message: "Hello from WebSocket server" }));

  // Lắng nghe tin nhắn từ client
  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    // Broadcast tới tất cả client khác
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
