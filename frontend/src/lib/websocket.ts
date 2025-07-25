import { toast } from "sonner";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL;
let socket: WebSocket | null = null;

export const connectWs = (
  endpoint: string,
  onMessage: (data: any) => void, //Call back nhận message
  onNoti: (data: any) => void
) => {
  socket = new WebSocket(`${URL}${endpoint}`);
  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === 'message') {
        const message = payload.data;
        onMessage(message); // GỌI CALLBACK ĐÃ TRUYỀN
      }
      if (payload.type === 'noti') {
        const noti = payload.data;
        onNoti(noti); // GỌI CALLBACK ĐÃ TRUYỀN
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(String(err));
      }
    }
  };

  socket.onclose = () => {
    console.log('WebSocket closed');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const sendMessage = (msgObj: any) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msgObj));
  }
};
