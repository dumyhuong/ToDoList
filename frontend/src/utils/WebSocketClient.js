export default class WebSocketClient {
  constructor(url, reconnectInterval = 3000) {
    this.url = url;
    this.client = null;
    this.reconnectInterval = reconnectInterval;

    this._onOpenCallback = null;
    this._onMessageCallback = null;
    this._onCloseCallback = null;
    this._onErrorCallback = null;

    this.messageQueue = [];
    this.connect();
  }

  connect() {
    this.client = new WebSocket(this.url);

    this.client.onopen = () => {
      console.log("WebSocket connected:", this.url);

      // gửi các message còn tồn đọng
      while (this.messageQueue.length > 0) {
        this.client.send(this.messageQueue.shift());
      }

      if (this._onOpenCallback) this._onOpenCallback();
    };

    this.client.onmessage = (event) => {
      if (this._onMessageCallback) {
        this._onMessageCallback(event.data);
      }
    };

    this.client.onerror = (err) => {
      console.error(" WebSocket Error:", err);
      if (this._onErrorCallback) this._onErrorCallback(err);
    };

    this.client.onclose = (event) => {
      console.warn(
        ` WebSocket closed (code=${event.code}, reason=${event.reason}), reconnecting in ${this.reconnectInterval / 1000}s...`
      );
      if (this._onCloseCallback) this._onCloseCallback(event);

      setTimeout(() => this.connect(), this.reconnectInterval);
    };
  }

  // === Public methods ===
  onopen(callback) {
    this._onOpenCallback = callback;
  }

  onmessage(callback) {
    this._onMessageCallback = callback;
  }

  onclose(callback) {
    this._onCloseCallback = callback;
  }

  onerror(callback) {
    this._onErrorCallback = callback;
  }

  send(message) {
    if (this.client && this.client.readyState === WebSocket.OPEN) {
      this.client.send(message);
    } else {
      console.warn("WebSocket not open, queueing message:", message);
      this.messageQueue.push(message);
    }
  }

  close() {
    if (this.client) {
      this.client.close();
    }
  }
}
