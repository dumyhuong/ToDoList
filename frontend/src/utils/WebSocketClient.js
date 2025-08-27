export default class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.client = null;
    this.connect();
  }

  connect() {
    this.client = new WebSocket(this.url);

    this.client.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };

    this.client.onclose = () => {
      console.log("WebSocket closed, retrying in 3s...");
      setTimeout(() => this.connect(), 3000); // auto reconnect
    };
  }

  onopen(callback) {
    this.client.onopen = callback;
  }

  onmessage(callback) {
    this.client.onmessage = (event) => {
      callback(event.data);
    };
  }

  onclose(callback) {
    this.client.onclose = callback;
  }

  send(message) {
    if (this.client.readyState === WebSocket.OPEN) {
      this.client.send(message);
    } else {
      console.warn("WebSocket not connected...", message);
    }
  }

  close() {
    if (this.client.readyState === WebSocket.OPEN) {
      this.client.close();
    }
  }
}
