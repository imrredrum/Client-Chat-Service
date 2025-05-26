export function sendMessage(
  socket: WebSocket | null,
  message: {
    uid: string
    name: string
    role: string
    content: string
    timestamp: string
  }
) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  }
}
