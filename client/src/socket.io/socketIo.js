import { io } from "socket.io-client"

const URL = import.meta.env.VITE_API_SOCKET_SERVER_URL

let socket

export const getSocket = () => {
    if (!socket)
        socket = io(URL)
    return socket
}