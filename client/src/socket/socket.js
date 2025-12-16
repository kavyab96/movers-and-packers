import { io } from "socket.io-client";

/**
 * Create ONE socket instance for the whole app
 * This avoids multiple connections
 */
export const socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
    //   "http://localhost:5000",
  {
    withCredentials: true,
    autoConnect: false // we control when to connect
  }
);
